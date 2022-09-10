Automation script for a quick and easy development setup

Note:
- If you are setting up environment variables, do not forget to go to Heroku webpage, and set the PKCS/RSA private key by yourself. This is because adding it programmatically seems to be impossible. Could not escape new line characters to port it to the Heroku app config vars. A little help about this matter could be seen [here](https://stackoverflow.com/questions/44360792/unable-to-set-rsa-private-key-as-config-var)
- Environment variables name from protected JSON resources/files: `[filename]_[field]_[subfield1]_..._[subfieldn]`
- This folder contains scripts that is used for deploying to Heroku. Since we are changing our service provider to Vercel, the only
thing that can be used here is test case generation. All automation is written in package.json instead.