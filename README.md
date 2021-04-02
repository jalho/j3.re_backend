# j3.re

This is the source of my personal website, a full stack web app. Find frontend and backend's source under [`packages/`](packages/).

Backend is deployed on Heroku and frontend on Vercel.

Due to Heroku's limitations the backend's dependencies are declared at the monorepo's root. Frontend's deps on the other hand are under the respective package since React app deployments are more adjustable on other service providers.

## First request's delay on Heroku

The app is being hosted on Heroku with a free plan meaning that it goes to sleep after 30 minutes of inactivity. It wakes up automatically upon any received traffic. This means the first request will have a delay but the subsequent ones will work normally. The behavior is documented at [devcenter.heroku.com](https://devcenter.heroku.com/articles/free-dyno-hours#dyno-sleeping).


## Required environment variables

(Secret) environment variables are excluded from version control. They must be added manually to the environment.

Create a `.env` file in the root directory of the project with content of shape:

    KEY1=VALUE1
    KEY2=VALUE2

| required for | key | value |
|-|-|-|
| database access | `MONGODB_URI` | `mongodb+srv://<username>:<password>@j3re.ytr5p.mongodb.net/<database name>?retryWrites=true&w=majority` |
| starting development server | `PORT` | `4000` - **Omit from Heroku!** |
| signing JSON Web Token | `JWT_SECRET` | *any string* |

where the placeholders must be replaced with the information obtained from [MongoDB dashboard](https://cloud.mongodb.com/):

* `<username>` is *j3reAdmin* (can be changed)

* `<password>` can be obtained from the dashboard

* `<database name>` is *j3re* (can be changed)

## Backend source structure

<details>
    <summary>Expand</summary>

*as of 27 August 2020*
```
src
¦   index.ts                # entry point
¦   
+---resolvers
¦       index.ts            # resolvers for GraphQL operations
¦       
+---schema                  # define data's shape in different implementations
¦   +---GraphQL
¦   ¦       index.ts        # GraphQL type definitions
¦   ¦       
¦   +---Mongoose
¦           index.ts        # Mongoose schemas and models
¦           
+---types
¦       index.d.ts          # own types
¦       
+---utils
        helpers.ts          # miscellaneous helper functions
        typeGuards.ts       # custom type guards for TypeScript
```
</details>