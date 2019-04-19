---
title: Slackbot in a tweet - AskToughQuestions
layout: post
---

First in a series, let's write slackbots that can fit in a tweet, and see how far that can go.
This one is an app with a few slash commands that answer any darn question you ask it!

## Code

```js
require('@runkit/runkit/express-endpoint/1.0.0')(exports)
.post('/', require('body-parser')(), (req, res) => {
  res.json({
    text: `_${req.body.text}_?\n*${Math.ceil(Math.random()*100)}% sure ${Math.random()>0.5?'YES':'NO'}!*`,
    response_type: 'in_channel'
  })
})
```

^ That leaves over 10 more characters still to spare!

Hosted on [Runkit](https://runkit.com/asyncanup/slackbot-is-the-president)

## Examples

![/IsThePresident exonerated?]({{ site.baseurl }}{{ site.imgurl }}/toughq-ispres.png)

![/am-i doing ok?]({{ site.baseurl }}{{ site.imgurl }}/toughq-ami.png)

![/IsLove overrated]({{ site.baseurl }}{{ site.imgurl }}/toughq-islove.png)

![/is_it_true_that Winnie the Pooh is a girl?]({{ site.baseurl }}{{ site.imgurl }}/toughq-winnie.png)

## Why did you do this?

To make a point that everyone should write Slackbots, and they don't need to be large projects. They can fit in a tweet!
You might even say, if you can write tweets, you can write slackbots (yikes).

# How do I use it?

Create a [new slash command](https://netflix.slack.com/apps/A0F82E8CA-slash-commands) in Slack,
with the Request URL: [https://runkit.io/asyncanup/slackbot-is-the-president/3.0.0](https://runkit.io/asyncanup/slackbot-is-the-president/3.0.0)
(or your own).

# How do I modify it?

Easiest way might be to hop over to the [Runkit Notebook](https://runkit.com/asyncanup/slackbot-is-the-president), clone it,
and publish it from the Runkit interface. Then the `endpoint` link atop the Notebook will give you your custom URL,
and changing code in the Notebook will modify the service.

Don't forget to update your Slash command's Request URL to your own `endpoint` link.

> Note:
> you don't have to be limited to a tweet's length to write your own modifications! That was just to get your attention :)

[Conversation on Twitter](https://twitter.com/asyncanup/status/1119326786167304192)
