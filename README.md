# Markdown plugin for Nodemailer

This applies to Nodemailer v1.0+. This plugin adds an option `markdown` for the Nodemailer e-mail options. This value will be used to populate `text` and `html` so you don't have to.

## Install

Install from npm

    npm install nodemailer-markdown --save

## Usage

#### 1. Load the `markdown` function

```javascript
var markdown = require('nodemailer-markdown').markdown;
```

#### 2. Attach it as a 'compile' handler for a nodemailer transport object

```javascript
nodemailerTransport.use('compile', markdown(options))
```

Where

  * **options** - includes options for the [marked](https://www.npmjs.org/package/marked) parser with the following additions:
      * **useEmbeddedImages** - if true, load or download referenced images and include these as attachments

#### 3. Set a `markdown` value

Any nodemailer content value can be used: String, Buffer, Stream or an object in the form of {path: filepath/url}

```javascript
var mailOptions1 = {
    markdown: '# Hello world!\n\nThis is a **markdown** message'
};
var mailOptions2 = {
    markdown: {path: __dirname + '/message.md'}
};
```

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
