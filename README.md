# [Alta Redwood](https://altaredwood.com) Store

# copyright 2019-2023 by [Daniel McKeown](https://danieljmckeown.com)

# ALL RIGHTS RESERVED

- an e-commerce web site
---

# QuickStart

`yarn run install`

`brew services start mongodb`

`yarn run dev`

*Includes:*
- login and registration (optional for purchase)
- product creation and management
- inventory management and automatic decrement on purchase
- user profile with previous purchases
---
### Built with OkConcept0 and modern web technologies

The Store is powered by [okconcept0](https://okconcept0.pacificio.com) which is from [Pacific IO](https://pacificio.com) and uses [NextJS](https://nextjs.org/) for front-end with [custom server and routing](https://github.com/zeit/next.js#custom-server-and-routing) and [ExpressJS](https://expressjs.com/) and was scaffolded using [create-next-app](https://open.segment.com/create-next-app/).  The UI is built with [ReactJS](https://reactjs.org/) components.  The app's databases are powered by [MongoDB](https://mongodb.com).
---
![parrot](./parrot-graphic.png "parrot graphic")
---

# Powered by NextJS [Custom server and routing](https://github.com/zeit/next.js#custom-server-and-routing).

*Because the Next.js server is just a node.js module you can combine it with any other part of the node.js ecosystem. in this case we are using express to build a custom router on top of Next.*


## Testing

- a basic Jest/Enzyme unit test setup has been added to this project
- still to do: make the test able to mount JSX elements
  - one test currently fails due to this issue
- `__tests__` directory is the place for test files 
- also has a hello-world style simple addition test
