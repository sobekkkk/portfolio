---
title: UofTCTF - Surgery
published: 2025-01-15
description: 'An easy osint challenge !'
image: ''
tags: [UofTCTF,]
category: 'OSINT'
draft: false 
lang: ''
---

# Intro
In this challenge, the author provided an image of a building and mentioned that a friend recommended a doctor at this clinic for facial plastic surgery.

We need to find this doctor.

Flag format: xxxx-xxxx xxxxx

This is the photo provided :

![](../../assets/images/Surgery/ChallengeImage.png)

<br>
<br>
<br>
<br>


# Find the clinic

First, I tried an `image search` using Google's reverse image search engine:

![](../../assets/images/Surgery/fifth.png)

This was a misleading track. However, `by adding 'plastic surgery'` to the query, we found some interesting things:

![](../../assets/images/Surgery/first.png)


We can see that the clinic is the `JK Plastic Surgery clinic` in Seoul.
lets see the [website](https://www.jkplastic.com/en/) : 

![](../../assets/images/Surgery/second.png)


<br>
<br>
<br>
<br>

# Find the doctor
After a good CTRL+F and the word doctor into, we can find the doctors list : 

![](../../assets/images/Surgery/third.png)

we know that the flag format is xxxx-xxxx xxxxx, so a `double-barrelled name`.
I tried the first one i saw, aaaaaaand...

![](../../assets/images/Surgery/fourth.png)

`Yes ! uofctf{Sung-Sik Kim} was the flag`
