"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMessageAttributes = exports.topicArnFromName = exports.topicNameFromArn = exports.validatePhoneNumber = exports.createMessageId = exports.createSnsTopicEvent = exports.createSnsLambdaEvent = exports.parseAttributes = exports.parseMessageAttributes = exports.arrayify = exports.createMetadata = exports.createAttr = void 0;
var uuid_1 = require("uuid");
function createAttr() {
    return {
        _attr: {
            xmlns: "http://sns.amazonaws.com/doc/2010-03-31/",
        },
    };
}
exports.createAttr = createAttr;
function createMetadata() {
    return {
        ResponseMetadata: [
            {
                RequestId: uuid_1.v4(),
            },
        ],
    };
}
exports.createMetadata = createMetadata;
function arrayify(obj) {
    return Object.keys(obj).map(function (key) {
        var x = {};
        x[key] = obj[key];
        return x;
    });
}
exports.arrayify = arrayify;
function parseMessageAttributes(body) {
    if (body.MessageStructure === "json") {
        return {};
    }
    var entries = Object.keys(body)
        .filter(function (key) { return key.startsWith("MessageAttributes.entry"); })
        .reduce(function (prev, key) {
        var index = key
            .replace("MessageAttributes.entry.", "")
            .match(/.*?(?=\.|$)/i)[0];
        return prev.includes(index) ? prev : __spreadArrays(prev, [index]);
    }, []);
    return entries
        .map(function (index) { return "MessageAttributes.entry." + index; })
        .reduce(function (prev, baseKey) {
        var _a;
        return (__assign(__assign({}, prev), (_a = {}, _a["" + body[baseKey + ".Name"]] = {
            Type: body[baseKey + ".Value.DataType"],
            Value: body[baseKey + ".Value.BinaryValue"] ||
                body[baseKey + ".Value.StringValue"],
        }, _a)));
    }, {});
}
exports.parseMessageAttributes = parseMessageAttributes;
function parseAttributes(body) {
    var indices = Object.keys(body)
        .filter(function (key) { return key.startsWith("Attributes.entry"); })
        .reduce(function (prev, key) {
        var index = key
            .replace("Attributes.entry.", "")
            .match(/.*?(?=\.|$)/i)[0];
        return prev.includes(index) ? prev : __spreadArrays(prev, [index]);
    }, []);
    var attrs = {};
    for (var _i = 0, _a = indices.map(function (index) { return "Attributes.entry." + index; }); _i < _a.length; _i++) {
        var key = _a[_i];
        attrs[body[key + ".key"]] = body[key + ".value"];
    }
    return attrs;
}
exports.parseAttributes = parseAttributes;
function createSnsLambdaEvent(topicArn, subscriptionArn, subject, message, messageId, messageAttributes) {
    return {
        Records: [
            {
                EventVersion: "1.0",
                EventSubscriptionArn: subscriptionArn,
                EventSource: "aws:sns",
                Sns: {
                    SignatureVersion: "1",
                    Timestamp: new Date().toISOString(),
                    Signature: "EXAMPLE",
                    SigningCertUrl: "EXAMPLE",
                    MessageId: messageId,
                    Message: message,
                    MessageAttributes: messageAttributes || {},
                    Type: "Notification",
                    UnsubscribeUrl: "EXAMPLE",
                    TopicArn: topicArn,
                    Subject: subject,
                },
            },
        ],
    };
}
exports.createSnsLambdaEvent = createSnsLambdaEvent;
function createSnsTopicEvent(topicArn, subscriptionArn, subject, message, messageId, messageStructure, messageAttributes) {
    return {
        SignatureVersion: "1",
        Timestamp: new Date().toISOString(),
        Signature: "EXAMPLE",
        SigningCertUrl: "EXAMPLE",
        MessageId: messageId,
        Message: message,
        MessageStructure: messageStructure,
        MessageAttributes: messageAttributes || {},
        Type: "Notification",
        UnsubscribeUrl: "EXAMPLE",
        TopicArn: topicArn,
        Subject: subject,
    };
}
exports.createSnsTopicEvent = createSnsTopicEvent;
function createMessageId() {
    return uuid_1.v4();
}
exports.createMessageId = createMessageId;
var phoneNumberValidator = /^\++?[1-9]\d{1,14}$/;
function validatePhoneNumber(phoneNumber) {
    if (!phoneNumberValidator.test(phoneNumber)) {
        throw new Error("PhoneNumber " + phoneNumber + " is not valid to publish");
    }
    return phoneNumber;
}
exports.validatePhoneNumber = validatePhoneNumber;
// the topics name is that last part of the ARN:
// arn:aws:sns:<REGION>:<ACCOUNT_ID>:<TOPIC_NAME>
var topicNameFromArn = function (arn) {
    var arnParts = arn.split(":");
    return arnParts[arnParts.length - 1];
};
exports.topicNameFromArn = topicNameFromArn;
var topicArnFromName = function (name, region, accountId) {
    return "arn:aws:sns:" + region + ":" + accountId + ":" + name;
};
exports.topicArnFromName = topicArnFromName;
var formatMessageAttributes = function (messageAttributes) {
    var newMessageAttributes = {};
    for (var _i = 0, _a = Object.entries(messageAttributes); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        newMessageAttributes[key] = {
            DataType: value.Type,
            StringValue: value.Value,
        };
    }
    return newMessageAttributes;
};
exports.formatMessageAttributes = formatMessageAttributes;
