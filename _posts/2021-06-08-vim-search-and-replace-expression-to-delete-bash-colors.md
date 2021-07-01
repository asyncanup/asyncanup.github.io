---
title: Vim Search and Replace regular expression to delete bash colors from file/buffer
layout: post
---

Ever wanted to delete bash colors from a file buffer, the ones that look like `^[[1;38m`?

```
%s/\v.\[(\d*;)*(\d*)m//g
```
