---
layout: post
comments: true
title: Unit Tests and Spring Boot
date:   2017-05-24
categories: java tdd unittest springboot frameworks
---

I have been practicing test driven development ([TDD](https://en.wikipedia.org/wiki/Test-driven_development)) in Java for a couple
of years now. Recently, I started using [Spring Boot](http://projects.spring.io/spring-boot/) framework. Spring Boot doesn't require XML configuration.
I can use ```@Autowired``` annotation to direct Spring Boot to inject the dependency for me. With my new found love for Spring Boot,
I wrote the following unit test for a project I had been working on.

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

I wrote a few more tests this way for my project before I realized I was doing something wrong. By using ```@Autowired``` here I made my test
 depend on Spring Boot framework. I had to also annotate my test class with ```@RunWith(SpringRunner.class)```
 and ```@SpringBootTest``` to support ```@Autowired```. By writing the test this way, every time I run the unit test, Spring boot fires up the
 embedded server to run the test. As a result, my test suite took longer to run.

### Overuse of framework

My unit test is trying to test a simple method ```tokenizeString()``` which takes an input string and returns tokens. There is nothing
here that requires me to depend on Spring Boot framework. I did not need to use ```@Autowired``` to initialize ```tokenService``` object.
I could have initialized my object the old fashioned way ```TokenService tokenService = new TokenService()```.

Once I got rid of ```@Autowired```, I did not need ```@SpringBootTest``` and ```@RunWith``` annotations.

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

//Omitted for brevity
{% endhighlight %}

The refactored test looks cleaner and runs faster.

### When to depend on framework in a unit test?

There are many instances when using framework in a unit test is necessary. For instance, I like to write unit tests for a REST controller to test my end points.

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

In this case, I could not have tested my REST end point without depending on Spring Boot annotations.

Frameworks are great. They make a developer's life easier in many ways. But
inappropriate or overuse of framework degrades code quality and maintainability.




{% include disqus.html %}