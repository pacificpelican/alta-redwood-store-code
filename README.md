# [Alta Redwood](https://altaredwood.com) Store

# copyright 2019-2023 by [Daniel McKeown](https://danieljmckeown.com)

# ALL RIGHTS RESERVED

- an e-commerce web site
- runs on NodeJS and MongoDB
---

# QuickStart

`npm install`

`brew services start mongodb-community@6.0`

`npm run dev`

*Includes:*
- login and registration (optional for purchase)
- product creation and management
- inventory management and automatic decrement on purchase
- user profile with previous logged-in purchases
- admin panel
---
### Built with OkConcept0 and modern web technologies

The Store is powered by [okconcept0](https://okconcept0.pacificio.com) which is from [Pacific IO](https://pacificio.com) and uses [NextJS](https://nextjs.org/) for front-end with [custom server and routing](https://github.com/zeit/next.js#custom-server-and-routing) and [ExpressJS](https://expressjs.com/) and was scaffolded using [create-next-app](https://open.segment.com/create-next-app/).  The UI is built with [ReactJS](https://reactjs.org/) components.  The app's databases are powered by [MongoDB](https://mongodb.com).
---
![parrot](./parrot-graphic.png "parrot graphic")
---

## Testing

- a basic Jest/Enzyme unit test setup has been added to this project
- still to do: make the test able to mount JSX elements
  - one test currently fails due to this issue
- `__tests__` directory is the place for test files 
- also has a hello-world style simple addition test
