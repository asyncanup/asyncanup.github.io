---
title: A rant about Monorepos
layout: post
---

Benefits of a mono-repo, based on experience from working at Netflix, Blippar,
and Aurora.

The point of a company-wide monorepo is so that your fact-finding efforts at
development time require navigating a chain of code vs navigating a chain of
people.

Walking through code is much more self-reliant and fast, given you CAN still
talk to people and ask questions.

No matter how professional, responsible and courteous your developers are at
maintaining documentation and answering queries from other teams, there is still
a human cost for someone to reach out in person.

That cost comes in the forms of:
1. Requests to access code.
2. Unnecessary invites on the calendar.
3. Queries about what's deployed or not, relevant or not, deprecated or about to
   be.
4. Hunting for real-world examples of usage of code across the company.

Another clear benefit is to have a singular technological backbone for the whole
company (or large team). Here's what that does:
1. Infrastructure cost gets consolidated, easier to reason about.
2. Frontend and backend code become less defensive, and more open to broader
   changes.

And benefits aren't just technological, but also organizational (thx @methodiva)

A monorepo inherently discourages code fiefdoms, and hits the sweet spot of
feeling ownership, where you feel ownership and responsibility for the whole
product, instead of your little castle in it.
