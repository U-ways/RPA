Documentation - Overview
================================================================================
Table of Content
--------------------------------------------------------------------------------

- [Development | Environment Set-up](#development-environment-set-up)
  - [Pre-requirements](#pre-requirements-)
  - [Build Instructions](#build-instructions-)
  - [Project initial configurations](#project-initial-configurations-)
    - [Cloud services](#cloud-services-)
    - [Environment variables](#environment-variables-)
  - [Starting the server](#starting-the-server-)
- [Back-end | Overview](#back-end)
- [Front-end | Overview](#front-end)

<sub>**NOTE:** Documentation will be provided for production environment on first release.</sub>



Development Environment Set-up
--------------------------------------------------------------------------------

### Pre-requirements:
- **Server-side:**
  - [Node.js][Node.js]. (`8.x LTS` release)
  - [Redis][Redis]. (`4.0 Stable` release)
- **Client-side:**
  - Firefox.
  - Chrome/Chromium.


### Build Instructions:
1. Clone project:
  - Using SSH: `git clone git@github.com:U-ways/RPA.git`
  - Using HTTPs: `git clone https://github.com/U-ways/RPA.git`
  - Or [Download as a ZIP](https://github.com/U-ways/RPA/archive/master.zip).
2. From project directory, switch to latest development branch:
  - `git checkout 0.0.0` <!-- FIXME: rename main development branch to development next time -->
3. Navigate to `package.json` folder:
  - GNU/Linux: `cd ./rpa`
4. Install project dependencies: `npm install`


### Project Initial Configurations:
Before you start the server, you need to create `.env.sh` file and place it in the app's root folder (see `.envExample.sh` for example/location)

#### Cloud services:
Then, there are a couple of services and API keys you need to obtain:

<table>
<tbody>
  <tr>
    <th>Service</th>
    <th>Instructions</th>
    <th>Further details and tips</th>
  </tr>
  <tr>
    <td>[MongoDB Atlas][Atlas]</td>
    <td>
      <ol>
        <li>[Create an Atlas account][Atlas_2].</li>
        <li>[Create a new cluster][Atlas_3].</li>
        <li>[Set-up a connection][Atlas_4] to the application's server.</li>
        <li>In your dashboard, go to your `Project > Clusters > Overview`.</li>
        <li>Click on `Connect > Connect Your Application`.</li>
        <li>Click on `Copy the connection string` to copy `.env.sh`:</li>
        <ul>
          <li>Copy SRV string w/ Admin's `USERNAME` & `PASSWORD` to `DEV_DB_URI_ADMIN`.</li>
          <li>Copy SRV string w/ User's `USERNAME` & `PASSWORD` to `DEV_DB_URI_USER`.</li>
        </ul>
        <sub>**Note:** remove `?retryWrites=true` from the [connection string][Atlas_5].</sub>
      </ol>
    </td>
    <td>
      <ul>
        <li>You will need to create 2 users in the cluster with the following [roles][Atlas_6]:</li>
        <ul>
          <li>Admin: `Atlas admin`.</li>
          <li>User:  `Read and write to any database`.</li>
        </ul>
        <li>Enabling the retryable writes (`?retryWrites=true`) on the [connection string][Atlas_5] can cause unpredictable errors.</li>
        <li>MongoDB Atlas offers a [free-tier account][Atlas_1].</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>[Google reCaptcha][reCaptcha]</td>
    <td>
      <ol>
        <li>First you need to have a [Google Account][reCaptcha_1].</li>
        <li>Then you can access the [reCaptcha Admin Panel][reCaptcha_2].</li>
        <li>Create 2 types of reCaptcha; [Checkbox][reCaptcha_3] and [Invisible][reCaptcha_4].</li>
        <li>Copy each reCaptcha's **Site key** & **Secret key** to `.env.sh`:</li>
        <ul>
          <li>**Checkbox**: `RECAP_SITE_KEY` & `RECAP_SECRET_KEY`.</li>
          <li>**Invisible**: `RECAP_INVIS_SITE_KEY` & `RECAP_INVIS_SECRET_KEY`.</li>
        </ul>
      </ol>
    </td>
    <td>
      <ul>
        <li>Don't mix up the `SITE_KEY` & `SECRET_KEY` variables!</li>
        <li>Check out reCAPTCHA's offical [Developer's Guide][reCaptcha_5].</li>
      <ul>
    </td>
  </tr>
  <tr>
    <td>[SendGrid][SendGrid]</td>
    <td>
      <ol>
        <li>[Signup for a SendGrid account][SendGrid_1].</li>
        <li>Login and go to [`Settings > API keys`][SendGrid_2].</li>
        <li>Create an API key, name it `admin-key`.</li>
        <ul>
          <li>Give it [full access permissions][SendGrid_3].</li>
        </ul>
        <li>Copy the API key to `.env.sh`:</li>
        <ul>
          <li>Copy it to `SG_ADMIN_KEY`.</li>
        </ul>
      </ol>
    </td>
    <td>
      <ul>
        <li>This API key is only used once on start-up, I have implemented my own API key rotation algorithm!</li>
        <li>SendGrid provides a [Free trial][SendGrid_4] for 30 days, afterwards you have 100 emails/day limit.</li>
        <li>Do not name your API key using the following format: `RPA-[NUMBER]` as it will expire.</li>
      <ul>
    </td>
  </tr>
</tbody>
</table>


#### Environment variables:
Finally, you need to review and sort out the rest of the environment to your preferences:

| variable | Description | Default value |
|----------|-------------|---------------|
| `NODE_ENV`    | The environment in which an application is running. (i.e. development, production, testing, etc.) | `"development"` |
| `HOST`        | The hostname the server listens to. | `"localhost"` |
| `HTTP_PORT`   | The port number the server listens to for HTTP requests. | `"3000"` |
| `REDIS_PORT`  | The port number the server listens to for the in-memory store. | `"6379"` |
| `SALT_ROUNDS` | The cost factor (time) to calculate a single hash  | `"12"` |
| `ADMIN_*`     | The root account within RPA application. | See `.envExample.sh` |
| `BOT_*`       | The robot account used for mailing services. | See `.envExample.sh` |
| `SECRET_N`    | The session cookie secret (used to sign the session ID cookie)  | A randomly generated 256-bit WEP Key |



### Starting the server:
This is the easy bit. After the Project Initial Configurations run:
- `npm test && npm start`

All tests should pass and the server should start listening to whatever hostname and port number you specified for HTTP. (If not, please open an issue with as many details as possible.)

________________________________________________________________________________

[Node.js]:https://nodejs.org/en/download/
[Redis]:https://redis.io/download

[Atlas]:https://www.mongodb.com/cloud/atlas
[Atlas_1]:https://www.mongodb.com/cloud/atlas/pricing
[Atlas_2]:https://docs.atlas.mongodb.com/getting-started/#a-create-an-service-user-account
[Atlas_3]:https://docs.atlas.mongodb.com/getting-started/#b-create-an-service-free-tier-cluster
[Atlas_4]:https://docs.atlas.mongodb.com/driver-connection/#connect-your-application
[Atlas_5]:https://docs.mongodb.com/manual/reference/connection-string/
[Atlas_6]:https://docs.atlas.mongodb.com/reference/user-roles/#project-roles

[reCaptcha]:https://developers.google.com/recaptcha/
[reCaptcha_1]:https://accounts.google.com
[reCaptcha_2]:http://www.google.com/recaptcha/admin
[reCaptcha_3]:https://developers.google.com/recaptcha/docs/display
[reCaptcha_4]:https://developers.google.com/recaptcha/docs/invisible
[reCaptcha_5]:https://developers.google.com/recaptcha/intro

[SendGrid]:https://sendgrid.com/
[SendGrid_1]:https://signup.sendgrid.com/
[SendGrid_2]:https://app.sendgrid.com/settings/api_keys
[SendGrid_3]:https://sendgrid.com/docs/API_Reference/Web_API_v3/API_Keys/api_key_permissions_list.html
[SendGrid_4]:https://sendgrid.com/pricing/
