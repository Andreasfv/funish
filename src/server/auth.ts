/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Organization, Role } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "../env/server.mjs";
import { prisma } from "./db";
import type { KSGUserResponse } from "./ksgQueries";
import { KSG_NETT_LOGIN_QUERY, KSG_NETT_USER_QUERY } from "./ksgQueries";

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
    ksgNettToken: string;
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
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/require-await
    jwt: async ({ token, user }) => {
      if (user) {
        token = {
          id: user.id,
          organizationId: user.organizationId,
          role: user.role,
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          ksgNettToken: user.ksgNettToken,
        };
      }
      return Promise.resolve(token);
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = (token.email as string) ?? "";
        session.user.name = (token.name as string) ?? "";
        session.user.organizationId = (token.organizationId as string) ?? "";
        session.user.role = (token.role as Role) ?? "";
        session.user.image = (token.image as string) ?? "";
        session.user.ksgNettToken = (token.ksgNettToken as string) ?? "";

        // session.user.role = user.role; <-- put other properties on the session here
      }
      return Promise.resolve(session);
    },
  },
  adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
    // Custom credentials providers against KSG-nett graphql API
    CredentialsProvider({
      credentials: {
        email: {
          label: "E-post",
          type: "text",
          placeholder: "Din KSG-nett e-post",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials == undefined) return null;
        console.log(credentials);
        const { email, password } = credentials;

        if (!email || !password) {
          return null;
        }
        const fetchResult = await fetch(`${env.KSG_NETT_API_URL}`, {
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
        });

        const response: KSGNettAPIResponse = await fetchResult.json();
        const { ok, token, user } = response.data.login;

        if (!ok) return null;
        if (!user) return null;
        if (!token) return null;
        let gangName: string | undefined = "";
        const fetchKSGUser = await fetch(`${env.KSG_NETT_API_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: KSG_NETT_USER_QUERY,
            variables: {
              id: user.id,
            },
          }),
        });
        const ksgUserResponse: KSGUserResponse = await fetchKSGUser.json();
        gangName = ksgUserResponse.data.user.ksgStatus.split(":")[0];
        // Find user's gang in ksg-nett
        const account = await prisma.account.findFirst({
          where: {
            id: user.id,
            provider: "ksg-nett",
          },
        });

        if (!account) {
          // Check if user's ksg gang exists in db
          const fetchKSGUser = await fetch(`${env.KSG_NETT_API_URL}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              query: KSG_NETT_USER_QUERY,
              variables: {
                id: user.id,
              },
            }),
          });
          const ksgUserResponse: KSGUserResponse = await fetchKSGUser.json();
          gangName = ksgUserResponse.data.user.ksgStatus.split(":")[0];
          console.log(gangName);

          // Check if ksg gang has an organization in db
          const organization = await prisma.organization.findUnique({
            where: {
              name: env.NODE_ENV === "development" ? gangName : gangName,
            },
          });
          console.log(organization);
          // if ksg gang does not have an organization create the organization
          let createdGang: Organization | null = null;
          if (!organization && gangName) {
            console.log("creating gang??");
            createdGang = await prisma.organization.create({
              data: {
                name: gangName,
              },
            });
          }

          let siteUser = await prisma.user.findUnique({
            where: {
              id: user.id,
            },
          });

          if (!createdGang && !organization)
            throw new Error("Error creating organization");

          const orgId = createdGang ? createdGang.id : organization?.id ?? "";
          if (!siteUser) {
            siteUser = await prisma.user.create({
              data: {
                id: user.id,
                name: ksgUserResponse.data.user.fullName,
                email: credentials.email,
                organizationId: orgId,
                image: ksgUserResponse.data.user.profileImage ?? "",
                role: createdGang ? "ORG_ADMIN" : "ORG_MEMBER",
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

          const resultUser: User = {
            id: siteUser.id,
            name: user.fullName,
            email: credentials.email,
            organizationId: orgId,
            role: siteUser.role,
            image: siteUser.image ?? "",
            ksgNettToken: token,
          };
          return resultUser;
        }

        if (account) {
          const siteUser = await prisma.user.findUnique({
            where: {
              id: user.id,
            },
          });

          if (!siteUser || !siteUser.email || !siteUser.organizationId) {
            return null;
          }

          const resultUser: User = {
            id: siteUser.id,
            name: siteUser.name ?? "",
            email: siteUser.email,
            organizationId: siteUser.organizationId,
            role: siteUser.role,
            image: siteUser.image ?? "",
            ksgNettToken: token,
          };

          return resultUser;
        }

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
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
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
