Documentation - Overview
================================================================================
Table of Content
--------------------------------------------------------------------------------

- [Development | Environment Set-up](#development-environment-set-up)
  - [Pre-requirements](#pre-requirements)
  - [Build Instructions](#build-instructions)
  - [Project initial configurations](#project-initial-configurations)
    - [Cloud services](#cloud-services)
    - [Environment variables](#environment-variables)
  - [Starting the server](#starting-the-server)
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
    <th width="40px">Service</th>
    <th>Instructions</th>
    <th width="30%">Further details and tips</th>
  </tr>
  <tr>
    <td><a href="https://www.mongodb.com/cloud/atlas">MongoDB Atlas</a></td>
    <td>
      <ol>
        <li><a href="https://docs.atlas.mongodb.com/getting-started/#a-create-an-service-user-account">Create an Atlas account</a>.</li>
        <li><a href="https://docs.atlas.mongodb.com/getting-started/#b-create-an-service-free-tier-cluster">Create a new cluster</a>.</li>
        <li><a href="https://docs.atlas.mongodb.com/driver-connection/#connect-your-application">Set-up a connection</a> to the application's server.</li>
        <li>In your dashboard, go to your <code>Project > Clusters > Overview</code>.</li>
        <li>Click on <code>Connect > Connect Your Application</code>.</li>
        <li>Click on <code>Copy the connection string</code> to copy <code>.env.sh</code>:</li>
        <ul>
          <li>Copy SRV string w/ Admin's <code>USERNAME</code> & <code>PASSWORD</code> to <code>DEV_DB_URI_ADMIN</code>.</li>
          <li>Copy SRV string w/ User's <code>USERNAME</code> & <code>PASSWORD</code> to <code>DEV_DB_URI_USER</code>.</li>
        </ul>
        <sub><b>Note:</b> remove <code>?retryWrites=true</code> from the <a href="https://docs.mongodb.com/manual/reference/connection-string/">connection string</a>.</sub>
      </ol>
    </td>
    <td>
      <ul>
        <li>You will need to create 2 users in the cluster with the following <a href="https://docs.atlas.mongodb.com/reference/user-roles/#project-roles">roles</a>:</li>
        <ul>
          <li>Admin: <code>Atlas admin</code>.</li>
          <li>User:  <code>Read and write to any database</code>.</li>
        </ul>
        <li>Enabling the retryable writes (<code>?retryWrites=true</code>) on the <a href="https://docs.mongodb.com/manual/reference/connection-string/">connection string</a> can cause unpredictable errors.</li>
        <li>MongoDB Atlas offers a <a href="https://www.mongodb.com/cloud/atlas/pricing">free-tier account</a>.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><a href="https://developers.google.com/recaptcha/">Google reCaptcha</a></td>
    <td>
      <ol>
        <li>First you need to have a <a href="https://accounts.google.com">Google Account</a>.</li>
        <li>Then you can access the <a href="http://www.google.com/recaptcha/admin">reCaptcha Admin Panel</a>.</li>
        <li>Create 2 types of reCaptcha; <a href="https://developers.google.com/recaptcha/docs/display">Checkbox</a> and <a href="https://developers.google.com/recaptcha/docs/invisible">Invisible</a>.</li>
        <li>Copy each reCaptcha's <b>Site key</b> & <b>Secret key</b> to <code>.env.sh</code>:</li>
        <ul>
          <li><b>Checkbox</b>: <code>RECAP_SITE_KEY</code> & <code>RECAP_SECRET_KEY</code>.</li>
          <li><b>Invisible</b>: <code>RECAP_INVIS_SITE_KEY</code> & <code>RECAP_INVIS_SECRET_KEY</code>.</li>
        </ul>
      </ol>
    </td>
    <td>
      <ul>
        <li>Don't mix up the <code>SITE_KEY</code> & <code>SECRET_KEY</code> variables!</li>
        <li>Check out reCAPTCHA's offical <a href="https://developers.google.com/recaptcha/intro">Developer's Guide</a>.</li>
      <ul>
    </td>
  </tr>
  <tr>
    <td><a href="https://sendgrid.com/">SendGrid</a></td>
    <td>
      <ol>
        <li><a href="https://signup.sendgrid.com/">Signup for a SendGrid account</a>.</li>
        <li>Login and go to <a href="https://app.sendgrid.com/settings/api_keys"><code>Settings > API keys</code></a>.</li>
        <li>Create an API key and name it <code>admin-key</code>.</li>
        <ul>
          <li>Give it <a href="https://sendgrid.com/docs/API_Reference/Web_API_v3/API_Keys/api_key_permissions_list.html">full access permissions</a>.</li>
        </ul>
        <li>Copy the API key to <code>.env.sh</code>:</li>
        <ul>
          <li>Copy it to <code>SG_ADMIN_KEY</code>.</li>
        </ul>
      </ol>
    </td>
    <td>
      <ul>
        <li>This API key is only used once on start-up, I have implemented my own API key rotation algorithm!</li>
        <li>SendGrid provides a <a href="https://sendgrid.com/pricing/">Free trial</a> for 30 days, afterwards you have 100 emails/day limit.</li>
        <li>Do not name your API key using the following format: <code>RPA-[NUMBER]</code> as it will expire.</li>
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
