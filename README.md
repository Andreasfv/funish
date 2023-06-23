Created with the CreateT3App bootstrap.

To run project:

1.  Run "yarn install"
2.  You need to provide a mysql url in .env, either by running localy 'mysql://root@localhost:3306/sp_development' or other providers like planetscale.
3.  npx prisma db push
4.  run npx prisma studio and add an organization named 'Lyche Bar'. ( This won't really matter unless you're a part of Lyche Bar as login is per now not possible unless you're registered in Lyche Bar on KSG-nett )
5.  Run "yarn dev"

It might be a bit dificult to get running locally as there is an abundance of unused .env values I haven't cleaned up since "finishing" working on this. I won't be continuing development unless the project actually becomes used by those it was made for as a potential solution to a . This project was made in company downtime for learning the new stack we are using. A live version can be found on mummi.ninja, but there's no test user and I won't be adding one for now as I've made an absolute jankfest of a login integration to KSG-nett(https://app.ksg-nett.no/) that pretty much requires users to be part of KSG to be able to log in. Which works as intended for current potential users.

Retrospect
Overall project is fine. There's some structural inefficiencies, like having to many individual versions of components instead of modular main components. As in I have a lot of components in the modules that probably can and should be a component in the src/components folder instead. Furthermore as this project had a clear end goal and a very limited timespan for doing so there's a lot of "just make it work" solutions rather than proper and clean solutions.

Additionally the design was made on a whim without any frameworking or time spent on design, I didn't give it much thought and focused on the functionality.
