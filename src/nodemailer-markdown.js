'use strict';

var marked = require('marked');
var crypto = require('crypto');

module.exports.markdown = function(options) {
    options = options || {};
    var renderer = options.renderer && Object.create(options.renderer) || new marked.Renderer();

    return function(mail, callback) {
        var handler = new Markdown(options, renderer);
        handler.process(mail, callback);
    };
};

function Markdown(options, renderer) {
    this._options = {};
    this._renderer = renderer;
    this._imageCount = 0;

    // create a shallow copy of the passed options
    Object.keys(options || {}).forEach(function(key) {
        this._options[key] = options[key];
    }.bind(this));

    if (options.useEmbeddedImages) {
        this._updateRenderer();
    }
}

Markdown.prototype.process = function(mail, callback) {
    if (!mail || !mail.data || !mail.data.markdown || mail.data.html) {
        return callback();
    }

    this._mail = mail || {};

    mail.resolveContent(mail.data, 'markdown', function(err, markdown) {
        if (err) {
            return callback(err);
        }

        markdown = (markdown || '').toString();
        marked(markdown, this._options, function(err, html) {
            if (err) {
                return callback(err);
            }

            mail.data.html = html;

            if (!mail.data.text) {
                mail.data.text = markdown;
            }

            callback(null);
        }.bind(this));
    }.bind(this));
};

Markdown.prototype._updateRenderer = function() {
    var imageRenderer = this._renderer.image;
    this._renderer.image = function(href, title, text) {
        return imageRenderer.call(this._renderer, 'cid:' + this._createImage(href).cid, title, text);
    }.bind(this);
    this._options.renderer = this._renderer;
};

Markdown.prototype._createImage = function(href) {
    var cid = (this._options.cidBase || crypto.randomBytes(8).toString('hex')) + '-' + (++this._imageCount) + '@localhost';
    var image = {
        path: href,
        cid: cid
    };

    if (!this._mail.data.attachments) {
        this._mail.data.attachments = [image];
    } else {
        this._mail.data.attachments.push(image);
    }

    return image;
};