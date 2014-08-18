'use strict';

var chai = require('chai');
var markdown = require('../src/nodemailer-markdown').markdown;

var expect = chai.expect;
chai.Assertion.includeStack = true;

describe('nodemailer-markdown tests', function() {
    it('should set html and text from markdown', function(done) {
        var plugin = markdown();
        var mail = {
            data: {
                markdown: 'Tere **vana kere**!'
            },
            resolveContent: function(obj, key, callback) {
                callback(null, this.data.markdown);
            }
        };
        plugin(mail, function(err) {
            expect(err).to.not.exist;
            expect(mail.data).to.deep.equal({
                markdown: 'Tere **vana kere**!',
                html: '<p>Tere <strong>vana kere</strong>!</p>\n',
                text: 'Tere **vana kere**!'
            });
            done();
        });
    });

    it('should return an error', function(done) {
        var plugin = markdown();
        var mail = {
            data: {
                markdown: 'Tere **vana kere**!'
            },
            resolveContent: function(obj, key, callback) {
                callback(new Error('failed'));
            }
        };
        plugin(mail, function(err) {
            expect(err).to.exist;
            done();
        });
    });

    it('should keep images as is', function(done) {
        var plugin = markdown();
        var mail = {
            data: {
                markdown: 'Tere ![Alt text](/path/to/img.jpg)!'
            },
            resolveContent: function(obj, key, callback) {
                callback(null, this.data.markdown);
            }
        };
        plugin(mail, function(err) {
            expect(err).to.not.exist;
            expect(mail.data).to.deep.equal({
                markdown: 'Tere ![Alt text](/path/to/img.jpg)!',
                html: '<p>Tere <img src="/path/to/img.jpg" alt="Alt text">!</p>\n',
                text: 'Tere ![Alt text](/path/to/img.jpg)!'
            });
            done();
        });
    });

    it('should replace images with cid links', function(done) {
        var plugin = markdown({
            useEmbeddedImages: true,
            cidBase: 'abc'
        });
        var mail = {
            data: {
                markdown: 'Tere ![Alt text](/path/to/img.jpg)!'
            },
            resolveContent: function(obj, key, callback) {
                callback(null, this.data.markdown);
            }
        };
        plugin(mail, function(err) {
            expect(err).to.not.exist;
            expect(mail.data).to.deep.equal({
                markdown: 'Tere ![Alt text](/path/to/img.jpg)!',
                attachments: [{
                    path: '/path/to/img.jpg',
                    cid: 'abc-1@localhost'
                }],
                html: '<p>Tere <img src="cid:abc-1@localhost" alt="Alt text">!</p>\n',
                text: 'Tere ![Alt text](/path/to/img.jpg)!'
            });
            done();
        });
    });
});