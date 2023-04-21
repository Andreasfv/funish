/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Role } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import Credentials from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { env } from "../env/server.mjs";
import { prisma } from "./db";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }

  interface User {
    id: string;
    organizationId: string;
    role: Role;
    name: string;
    email: string;
    image: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  events: {
    createUser({ user }) {
      console.log("createUser", user);
    },
    signIn({ user }) {
      return;
    },
  },
  callbacks: {
    signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.email = user.email;
        session.user.name = user.name;
        session.user.organizationId = user.organizationId;
        session.user.role = user.role;
        session.user.image = user.image;

        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Auth0Provider({
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      issuer: env.AUTH0_DOMAIN,
    }),
    // Custom credentials providers against KSG-nett graphql API
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "E-post",
          type: "text",
          placeholder: "Din KSG-nett e-post",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials == undefined) return null;

        const { email, password } = credentials;

        if (!email || !password) {
          return null;
        }

        await fetch(`${env.KSG_NETT_AUTH_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: KSG_NETT_LOGIN_QUERY,
            variables: {
              username: credentials.email,
              password: credentials.password,
            },
          }),
        })
          .then((res) => res.json())
          // .then(async (res: KSGNettAPIResponse) => { // if awaiting prisma upsert
          .then(async (res: KSGNettAPIResponse) => {
            const {
              data: {
                // Doing nothing with token now but can be attached to session
                // or in some authorization header? But only required if we
                // want to make subsequent requests to KSG-nett API beyond
                // just third party auth.
                login: { ok, token, user },
              },
            } = res;
            console.log("?");
            if (!ok) return null;
            console.log("??");
            // If ok is true, then user and token should be defined.
            // But compiler isn't smart enough to know that.
            if (!user) return null;
            //async function that checks if account exists for user
            //if not, create account

            const account = await prisma.account.findFirst({
              where: {
                id: user.id,
                provider: "ksg-nett",
              },
            });

            if (!account) {
              const organization = await prisma.organization.findUnique({
                where: {
                  name: "Lyche Dev",
                },
              });

              if (!organization) {
                throw new Error("Organization not found, whopsie!");
              }

              let siteUser = await prisma.user.findUnique({
                where: {
                  id: user.id,
                },
              });

              if (!siteUser) {
                console.log("Ohayoo");
                siteUser = await prisma.user.create({
                  data: {
                    id: user.id,
                    name: user.fullName,
                    email: credentials.email,
                    organizationId: organization.id,
                  },
                });
              }

              if (!siteUser) {
                throw new Error("User failed to be created");
              }

              await prisma.account.create({
                data: {
                  id: user.id,
                  userId: siteUser.id,
                  providerAccountId: user.id,
                  access_token: token,
                  type: "ksg-nett",
                  provider: "ksg-nett",
                },
              });

              return {
                id: siteUser.id,
                name: user.fullName,
                email: credentials.email,
              };
            }

            if (account) {
              const siteUser = await prisma.user.findUnique({
                where: {
                  id: user.id,
                },
              });

              if (!siteUser) {
                throw new Error("User something wrong");
              }

              return siteUser;
            }

            return {
              // According to docs this is set in the session.user property
              // NextAuth then uses its own JWT? We already get a token from
              // KSG-nett so ideally we could derive the JWT from that. But not sure
              // how to go about doing that
              id: user.id,
              name: user.fullName,
              email: credentials.email,
            };

            /**
             ** Not sure if this even works. Couldn't bother installing mysql.
             ** But probably something along these lines. Remember to make call async. */
            // await prisma.user.upsert({
            //   where: {
            //     id: user.id,
            //   },
            //   update: {},
            //   create: {
            //     id: user.id,
            //     name: user.fullName,
            //     email: credentials.email,
            //     role: Role.ORG_MEMBER,
            //   },
            // });
          });

        return null;
      },
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
  secret: env.JWT_SECRET,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

// Put this somewhere else maybe?
const KSG_NETT_LOGIN_QUERY = `
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    ok
    token
    user {
      id
      fullName
    }
  }
}
`;
// Same as above
type KSGNettAPIResponse = {
  data: {
    login: {
      ok: boolean;
      token: string | null;
      user: {
        id: string;
        fullName: string;
      } | null;
    };
  };
};
