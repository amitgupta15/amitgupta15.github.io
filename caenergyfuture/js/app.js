(function() {
    var typed = new Typed('.intro-subtext', {
        stringsElement: '#typed-strings',
        typeSpeed: 70,
        backSpeed: 70,
        backDelay: 2000,
        smartBackspace: true,
        loop: true,
        showCursor: false,
    });

    var engageButton = document.querySelector('.engage-btn');
    setTimeout(function() {
        engageButton.style.display = 'inline-block';
    }, 5000);

    window.onscroll = function() {
        var nav = document.querySelector('nav');
        if (this.window.scrollY > 150) {
            nav.classList.add('active-nav');
        } else {
            nav.classList.remove('active-nav');
        }
    };
})();
