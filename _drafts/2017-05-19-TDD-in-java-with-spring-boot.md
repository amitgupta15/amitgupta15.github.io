---
layout: post
comments: true
title:  "TDD in Java with Spring Boot"
date:   2017-05-19
categories: java, tdd
---



## Main Idea
Create a video blog with transcript to show how to do test driven development in Java with spring boot

## Theme
- Pragmatic test driven development
- Readable test: No hidden inputs. Each test should be self contained.
- Write enough code to pass the test and validate a feature under development
- Use framework only when needed.
- Overuse of framework slows down testing
- Overuse of framework produces ugly and hard to read code
- Don’t introduce Database until it is actually needed
- First introduce in-memory database for acceptance testing
- Use Gauge or Fitnesse for acceptance testing once enough product is built.
- Show how to write and test Front end in Angular
- Show how to package deploy

## Plan
- Break down in episodes
- What to cover in first episode?
- Intermingle video and text?
- Write down the narrative


## TDD

### What is TDD?
### Should we write integration tests as part of TDD?
- NO
### Correct way to practice TDD
- Automate the tests - One click to run all the tests
- Fast running tests - less than a second is ideal
### Show a bad test, ask what is bad about it, then clean up the test
### What to test?
- Is it worth writing a test for a method that just prints something?
- Decide when to write a test
- Decide what to test - what input, what output?
- Visibility of methods should be driven by tests. If a method needs to
  be tested, it is OK to make it protected or public.
- Test some real logic


Test driven development is an emotional subject for developers. Some love it and some hate it with a passion.
Some are just oblivious to its existence. In my opinion, if you’re writing any program that is doing something more than printing
```Hello World```, then you would benefit from TDD.

{% highlight java %}
public static void main(String[] args) {
    System.out.println("Hello, World!");
}
{% endhighlight %}

<script src="https://gist.github.com/amitgupta15/7c733ad70e021735fb0f39288cdc0d23.js"></script>

TDD is definitely an overkill for this kind of program. A test would would not give you any ROI and will be a complete waste of time.

Let's say you are writing a simple method that adds two numbers. TDD is perhaps an overkill for that too.

{% highlight java %}
private int add(int a, int b) {
    return a + b;
}
{% endhighlight %}
<script src="https://gist.github.com/amitgupta15/6cb2276defbc282279bb71167c9aa2bb.js"></script>

This method will work for any ```int``` arguments.

You want to start with a unit test where you can think of either
1. boundary conditions
2. logic that would benefit from the test

Let's say you have a method that is dividing two ```int``` values. This could be interesting. There are at least a couple of things you would like to test
1. Handle divide by 0
2. Handle a numerator smaller than denominator

In TDD you start with a test

{% highlight java %}
public Class DivisionTests {
    
    @Test
    public void divisionTest() {
        assertThat(divide(4,2)).isEqualTo(2); //Normal scenario
        assertThat(divide(4/0)).isEqualTo(-1); //Indicate an error
        assertThat(divide(3/2)).isEqualTo(1); //Returns only the quotient
        assertThat(divide(0/1)).isEqualTo(0); //Anything divide by 0 is zero
        assertThat(divide(2/4)).isEqualTo(0); //Numerator is smaller than denominator
    }
    
    private int divide(int numerator, int denominator) {
        if(denominator == 0) {
            return -1;
        } else if(numerator < denominator) {
            return 0;
        } else {
            return numerator/denominator;
        }
        
    }
}
{% endhighlight %}

Mastering TDD takes practice. The idea is to keep the code readable and testable. This is easier said than done.
Developers who are new to TDD either don’t know where to start and what to test.
Sometimes they write way too many tests for things that don’t give any return on investment (ROI).
I myself am guilty on both accounts. I am still learning and the more I practice the better I get (cliche but true).
I practice TDD in Java and in my Node.js projects. If I’m learning a new language, once I learn the syntax the first
thing I look for is how to write tests in that language.

In this post our focus will be on Java obviously. I have found that the best way to start writing code is to think of the smallest problem
you can solve with a unit test and write the code. At this point you are not thinking about frameworks, database, design patterns or any other
high level aspect. You think about what is the problem, what will be the input and what will be the output.

To illustrate, in this blog we will work on developing search application which takes in a search phrase
as an input and searches through an array of topics to find a match. That’s our overall problem definition. Now, where do we start?

Let's take another look at the problem again. Let's say we have a list
of topics like
```
# Topics 
1. What are my bill pay options?
2. How can I manange my account?
3. How can I retrieve my username and password?
4. I can I contact customer support?
```

Our search phrase is ```How do I pay my bill online?``` For this phrase
we should get the response ```What are my bill pay options?```

Now how do we do this?
1. Extract keywords out of search phrase
2. Match the keywords with the topic list to find a match.

So the first thing we need to do is extract keywords from the search
phrase. For that our first step would be to tokenize the search phrase

```show code here ```


## Framework
Frameworks are great. They help take care of a lot of boilerplate code
that we should be otherwise writing. But sometimes we end up using too
much framework. We use frameworks in places that we should not. This
results in smelly code, slow running unit tests.

-- show example of tests written with spring boot, show the run time.
These tests use @Autowired, mock objects and @SpringBootTest when the
same test can be written any of that. A cleaner test will be much faster
to run

-- show example of a cleaner test without framework

-- Write a controller test. this requires framework support. Use MockMvc
to test a rest api call.

-- talk about boundaries. How much to test. Always keep the purpose of
testing in the forefront.
