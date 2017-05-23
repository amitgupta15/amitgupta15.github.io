---
layout: post
comments: true
title: Unit Tests and Spring Boot
date:   2017-05-23
categories: java, tdd, unit test, spring boot, frameworks
---

Following code tests a method that tokenizes a given string. What is
wrong with unit test?

{% highlight java %}
@RunWith(SpringRunner.class)
@SpringBootTest
public class TokenServiceTests {

    @Autowired
    TokenService tokenService;

    @Test
    public void tokenizeStringTest() {
        String stringToTokenize = "How do I pay my bill online?";
        Set<String> expectedTokens = new HashSet<>(Arrays.asList("how","do","i","pay","my","bill","online"));
        Set<String> actualTokens = tokenService.tokenizeString(stringToTokenize);

        assertThat(actualTokens).isEqualTo(expectedTokens);
    }
}

@Service
class TokenService {

    String REGEX_TO_REMOVE_PUNCTUATIONS = "[\\p{P}\\p{S}]";

    public Set<String> tokenizeString(String string) {
        Set<String> tokens = new HashSet<>();
        StringTokenizer stringTokenizer = new StringTokenizer(string.toLowerCase().replaceAll(REGEX_TO_REMOVE_PUNCTUATIONS,""));
        while(stringTokenizer.hasMoreTokens()) {
            tokens.add(stringTokenizer.nextToken());
        }
        return tokens;
    }
}
{% endhighlight %}

Let's see what is going on here:
1. The unit test is using ```@Autowired``` annotation from Spring
   Framework to inject ```TokenService``` class
2. To support ```@Autowired``` the unit test is using
   ```@SpringBootTest``` and ```@RunWith(SpringRunner.class)```

By doing this, every time we run the unit test, Spring boot fires up
embedded server to run the test. As a result the test takes 83ms to run

![testruntime-withspringboot.png](/testruntime-withspringboot.png)

You might be thinking that 85ms is not a big deal, and it is not in this
case. But imagine having 10 or 12 different test classes all using
```@SpringBootTest``` and ```@RunWith(SpringRunner.class)```. It will
significantly impact test time.

This is an actual test I wrote for one of my projects. I had about 12
test classes all using ```@SpringBootTest``` and
```@RunWith(SpringRunner.class)```. I was overzealous about TDD and
about Spring Boot.

But then I asked myself, why do I need ```@Autowired``` in this test?
How is ```@Autowired``` helping me improve the test or testability of
the underlying code?

The answer is ```@Autowired``` is not helping me in any way. It only
made the test more complicated and slower. I can create an instance of
```TokenService``` class using ```new``` and it will be perfectly fine.

Once I got rid of ```@Autowired```, I could safely remove
```@SpringBootTest``` and ```@RunWith(SpringRunner.class)``` annotations
as well since I was using them only to support ```@Autowired```.

Here's the refactored test

{% highlight java %}
public class TokenServiceTests {

    TokenService tokenService = new TokenService();

    @Test
    public void tokenizeStringTest() {
        String stringToTokenize = "How do I pay my bill online?";
        Set<String> expectedTokens = new HashSet<>(Arrays.asList("how","do","i","pay","my","bill","online"));
        Set<String> actualTokens = tokenService.tokenizeString(stringToTokenize);

        assertThat(actualTokens).isEqualTo(expectedTokens);
    }
}

//Omitted rest of the code for brevity
{% endhighlight %}

Now the test looks cleaner and runs faster by 14ms.

![testruntime-wospringboot.png](/testruntime-wospringboot.png)

### Don't overuse framework
Frameworks are great. They make a developer's life easier by taking care
of boilerplate code that a developer would have to write otherwise. But
inappropriate or overuse of framework degrades code quality and slows
down development time.

### Appropriate use of framework in a unit test
As I already mentioned, overusing framework produces bad code, but there
are times when using framework in a unit test is helpful and perhaps necessary.

Let's say you're writing a REST controller in Spring Boot. I like to
write a unit test for the REST controller to test my end points.

{% highlight java %}
@RunWith(SpringJUnit4ClassRunner.class)
@WebMvcTest
public class SearchRestControllerTests {

    @Autowired
    MockMvc mockMvc;

    @Test
    public void searchEndPointTest() throws Exception {
        String searchPhrase = "How do I pay my bill";
        mockMvc.perform(get("/api/search/" + searchPhrase))
                .andExpect(status().isOk());
    }
}

@RestController
class SearchRestController {

    @RequestMapping(value = "/api/search/{searchPhrase}", method = RequestMethod.GET)
    @ResponseBody
    public String search(@PathVariable String searchPhrase) {
        return "Pay Bill";
    }
}
{% endhighlight %}

Here I have ```@Autowired``` ```MockMvc``` class in my unit test so that
I can test the ```/api/search/{searchPhrase}``` REST end point. I have
also used ```@RunWith(SpringJUnit4ClassRunner.class)``` and
```@WebMvcTest``` annotations to run my test.

Without the help of framework I would have to write quite a bit of code
to test my end point.

With this test in place, if I or some other developer changes or deletes
the ```/api/search/{searchPhrase}``` end point, I will immediately find
out when I run my unit tests.


{% include disqus.html %}