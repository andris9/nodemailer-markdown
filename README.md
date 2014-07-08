# Mardown plugin for Nodemailer

This applies to Nodemailer v1.0+. This plugin adds an option `markdown` for the Nodemailer e-mail options. This value will be used to populate `text` and `html` so you don't have to.

## Install

Install from npm

    npm install nodemailer-markdown --save

## Usage

Load the `markdown` function

```javascript
var markdown = require('nodemailer-markdown').markdown;
```

Attach it as a 'compile' handler for a nodemailer transport object

```javascript
nodemailerTransport.use('compile', markdown(options))
```

Where

  * **options** - includes options for the [marked](https://www.npmjs.org/package/marked) parser with the following additions:
      * **useEmbeddedImages** - if true, load or download referenced images and include these as attachments


## Example

```javascript
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();
transporter.use('compile', markdown());
transporter.sendMail({
    from: 'me@example.com',
    to: 'receiver@example.com',
    markdown: '# Hello world!\n\nThis is a **markdown** message'
});
```

## License

**MIT**