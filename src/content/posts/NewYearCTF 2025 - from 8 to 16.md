---
title: NewYearCTF 2025 - from 8 to 16
published: 2025-01-15
description: 'This is the first "reverse engineering" challenge of the NewYear 2025 CTF'
image: ''
tags: [NewYearCTF2025]
category: 'Reverse'
draft: false 
lang: ''
---


# Intro
This is the first "reverse engineering" challenge of the NewYear 2025 CTF. I put "reverse engineering" in quotes because they categorized it under this category, but I think it’s more of a programming challenge than anything else.

In this challenge, they provided us with a Python program and an encrypted file, which has been encrypted using the Python file:

<br>


![](../../assets/images/from%208%20to%2016/Dropped%20Image.png)

<br>
<br>
<br>
<br>

# The python program

Let's take a look at the python program : 

```python
def rev001(flag):
    return ''.join([chr((ord(flag[i]) << 8) + ord(flag[i + 1])) for i in range(0, len(flag), 2)])
```

Easy, right? Seriously, the first time I saw this program, I thought "Yes, an easy challenge for a noob like me!!"...

<br>
<br>

## "deconstructed code"

After 3 minutes of staring at this beautiful one-liner, I was totally lost, lol. So, I started by "deconstructing" the code like this:

It's not exactly the same as the first code but principle is the same.


```python
def rev001(flag):
    result = []
    for i in range(0, len(flag), 2):
        combined_char = (ord(flag[i]) << 8) + ord(flag[i + 1])
        result.append(chr(combined_char))
    return ''.join(result)
```

That way, it was a little bit more understandable for me.

<br>
<br>

## explanation

First, we create a list to store the encrypted result.

```python
result = []
```

Next, we have a loop that iterates over the length of the flag, but only on the even numbers. Here, `i` can take the values 0, 2, 4, 6, etc.

```python
for i in range(0, len(flag), 2):
```

Inside this loop, you can see the `combined_char` variable, which contains `ord(flag[i])`: this converts the character at index i into a Unicode code point.

:::important
ASCII (American Standard Code for Information Interchange) and Unicode are two standard ways to represent text in computers and other devices. They assign a unique number to each character, such as letters, digits, and punctuation marks. For example, the letter 'A' is represented by the number 65, and 'a' by 97. This ensures that different computers can communicate using a common language.
:::


```python
combined_char = (ord(flag[i]) << 8) + ord(flag[i + 1])
```

By adding `<< 8 ` to `ord(flag[i])`, it shifts the Unicode code point 8 bits to the left. That means the Unicode code point is multiplied by 256 (shifting 8 bits to the left is equivalent to multiplying by 2^8 = 256). It's not just a naive assembly of two characters, it’s a single character encoding on 16 bits, but we’ll see that in detail later...

:::note[Example] 
- `ord('A')` gives 65
- `65 << 8` shifts the bits of 65 (which is 01000001 in binary) 8 positions to the left, resulting in 01000001 00000000 in binary, which is 16640 in decimal.
:::


Next, `ord(flag[i + 1])` convert the char at the +1 index into its ASCII code.

This way, `(ord(flag[i]) << 8) + ord(flag[i + 1])` adds the two Unicode code points to get a single combined Unicode code point.


:::note[explanation] 
as we said earlier :

- `ord('A')` gives 65
- `65 << 8` shifts the bits of 65 (which is 01000001 in binary) 8 positions to the left, resulting in 0100000100000000 in binary.

You might now be asking yourself why we shift by 8 positions to the left? We have the answer further up!

The final operation is to add the 8-bit ASCII code. And 8+8 = 16. Genius, right? :)

So, why do we want a 16-bit Unicode character code? Because this allows us to combine two 8-bit values into a single 16-bit value without any overlap or loss of information. So we can safely perform this addition: `(ord(flag[i]) << 8) + ord(flag[i + 1])`
:::

the last intersting line :

```python
result.append(chr(combined_char))
```

convert our combined ASCII code to a unicode char and adds it into the `result` list.

the final line concatenates all the chars in the `result` list into one string and returns it.

```python
return ''.join(result)
```

<br>
<br>
<br>
<br>


# Exploit

if we check the `enc-transf` file, we can see that it contains `杲潤湯筩湳瑥慤彯晟㡟扩瑳彭慫敟ㄶ形楴獽` which is the encrypted flag.

letss try to decrypt it ! :')

<br>

## My code

So, as a beginner, I just tried to break down the different steps of the encryption and reverse them by thinking about how they work.

for example if the fist code make an ASCII encode, i have to perform an ASCII decode. If it shifts by 8 bits to the left, i shift by 8 to the right and so on ....

this method gave me this code : 


```python 

def rev001_reverse(encoded):
    flag = []
    for i in range(len(encoded)):
        combined = ord(encoded[i])
        
        high = (combined >> 8) & 0xFF  
        low = combined & 0xFF  
        
        flag.append(chr(high))
        flag.append(chr(low))
    
    return ''.join(flag)

print(rev001_reverse("杲潤湯筩湳瑥慤彯晟㡟扩瑳彭慫敟ㄶ形楴獽"))
```

let me explain it : 

First, I declare a flag variable `flag = []`, which will store the result.

```python
for i in range(len(encoded)):
```

Next, I initiate a loop that iterates over the length of the encrypted text.

```python
for i in range(len(encoded)):
```

Now, we want to convert each char to its unicode value, and we do that whith this line :

```python
combined = ord(encoded[i])
```

Let’s move on to the more difficult part : 

```python
high = (combined >> 8) & 0xFF  
low = combined & 0xFF
```

the `high variable` is the result of the `right-shifting` of the unicode code by 8 bits to get the higher 8 bits (high part). `& 0xFF` is used to apply a mask to ensure only the lower 8 bits are kept.
the `low variable`,  `low = combined & 0xFF`, applies a mask to get the lower 8 bits (low part)


:::note[explanation] 
Let's make a deeper and concrete explanation : 

In response to the encoding code (which combined two 8 bits ASCII values), we now want to separate these two 8 bits values to recover the original values. 

Suppose encoded_text is "杲潤湯筩湳瑥慤彯晟㡟扩瑳彭慫敟ㄶ形楴獽".

For the first char (encoded[0], which is 杲) :

- `combined = ord('杲')`: Converts '杲' to its Unicode code : ` 26482` (01100111 01110010 in binary).
- `high = (26482 >> 8) & 0xFF `: results in 103 because `combined` is 26482 (01100111 01110010 in binary), and by taking the higher 8 bits (right-shifting -> to get back the original byte value, 01100111 01110010 ≫ 8  = 00000000 01100111) we get  : 01100111 in binary so, 103 in decimal.
- `low = combined & 0xFF`: the mask `0xFF` (255 in Decimal, 11111111 in binary) is used to take the lower 8 bits : 01100111 01110010 & 11111111 = 01110010 = 114 in decimal.

then, `chr(103)` is 'g'and `chr(114)` is 'r'

now we have flag = ['g','r']

etc etc ...

:::



Then, these two lines: 

```python
flag.append(chr(high))
flag.append(chr(low))
```

convert the high and low part to  ASCII chars and add them into the `flag` list

Finally , we just need to `return ''.join(flag)`; which joins all the chars in the flag list into a single string and returns it.


# POC 

Here, I added some prints to visualize what i explained above: 

![](../../assets/images/from%208%20to%2016/poc.png)

We have the flag ! :)

This challenge was particularly interesting because it can be approached in two different ways : 

- First, you can simply try to reverse it by canceling each action in the original file.
- But you can also try to understand what really happened from a "low-level" perspective, which is very enriching!


Thx for reading, see you 😋














