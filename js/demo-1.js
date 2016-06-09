(function() {

    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height+'px';

        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for(var x = 0; x < width; x = x + width/20) {
            for(var y = 0; y < height; y = y + height/20) {
                var px = x + Math.random()*width/20;
                var py = y + Math.random()*height/20;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in points) {
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(156,217,249,'+ p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(156,217,249,'+ _this.active+')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
    
})();

var chineseZodiac = [
{
    sign: 'Rat',
    year: [1912, 1924, 1936, 1946, 1960, 1972, 1984, 1996, 2008, 2020],
    image: 'img/rat.png',
    strength: 'Adaptable, smart, cautious, acute, alert, positive, flexible, outgoing, cheerful',
    weakness: 'Timid, unstable, stubborn, picky, lack of persistence, querulous',
    bestMatches: 'Ox, Rabbit, Dragon',
    badMatches: 'Horse, Rooster'
},
{
    sign: 'Ox',
    year: [1913, 1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021],
    image: 'img/ox.png',
    strength: 'honest, industrious, patient, cautious, level-headed, strong-willed, persistent',
    weakness: 'obstinate, inarticulate, prudish, distant',
    bestMatches: 'Rat, Monkey, Rooster',
    badMatches: 'Tiger, Dragon, Horse, Sheep'
},
{
    sign: 'Tiger',
    year: [1914, 1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022],
    image: 'img/tiger.png',
    strength: 'Tolerant, loyal, valiant, courageous, trustworthy, intelligent, virtuous',
    weakness: 'Arrogant, short-tempered, hasty, traitorous',
    bestMatches: 'Dragon, Horse, Pig',
    badMatches: 'Ox, Tiger, Snake, Monkey'
},
{
    sign: 'Rabbit',
    year: [1915, 1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023],
    image: 'img/rabbit.png',
    strength: 'Gentle, sensitive, compassionate, amiable, modest, and merciful',
    weakness: 'Amorous, hesitant, stubborn, timid, conservative',
    bestMatches: 'Sheep, Monkey, Dog, Pig',
    badMatches: 'Snake, Rooster'
},
{
    sign: 'Dragon',
    year: [1916, 1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024],
    image: 'img/dragon.png',
    strength: 'Decisive, inspiring, magnanimous, sensitive, ambitious, romantic',
    weakness: 'Eccentric, tactless, fiery, intolerant, unrealistic',
    bestMatches: 'Rat, Tiger, Snake',
    badMatches: 'Ox, Sheep, Dog'
},
{
    sign: 'Snake',
    year: [1917, 1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025],
    image: 'img/snake.png',
    strength: 'Soft-spoken, humorous, sympathetic, determined, passionate, smart',
    weakness: 'Jealous, suspicious, sly, fickle, nonchalant',
    bestMatches: 'Dragon, Rooster',
    badMatches: 'Tiger, Rabbit, Snake, Sheep, Pig'
},
{
    sign: 'Horse',
    year: [1918, 1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026],
    image: 'img/horse.png',
    strength: 'Most have nice personalities, such as warm-hearted, upright and easygoing. Hence, they usually have a lot of friends flocking around them. Independence and endurance makes them more powerful, and they do not easily give up when in difficulties. Positive attitude leads to a brighter direction.',
    weakness: 'The love of spending seems to be the biggest problem since they must be financially well off to support their social activities and outlook. Besides, their frank attitude at times leads to letting out secret easily. Persistence is what they lack on the path of success.',
    bestMatches: 'Tiger, Sheep, Rabbit',
    badMatches: 'Rat, Ox, Rooster'
},
{
    sign: 'Sheep',
    year: [1919,, 1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027],
    image: 'img/sheep.png',
    strength: 'gentle, softhearted, considerate, attractive, hardworking, persistent, thrift',
    weakness: 'indecisive, timid, vain, pessimistic, moody, weak-willed',
    bestMatches: 'Horse, Rabbit, Pig',
    badMatches: 'Ox, Tiger, Dog'
},
{
    sign: 'Monkey',
    year: [1920, 1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028],
    image: 'img/monkey.png',
    strength: 'enthusiastic, self-assured, sociable, innovative',
    weakness: 'jealous, suspicious, cunning, selfish, arrogant',
    bestMatches: 'Ox, Rabbit',
    badMatches: 'Tiger, Pig'
},
{
    sign: 'Rooster',
    year: [1921, 1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029],
    image: 'img/rooster.png',
    strength: 'Independent, capable, warm-hearted, self-respect, quick minded',
    weakness: 'Impatient, critical, eccentric, narrow-minded, selfish',
    bestMatches: 'Ox, Snake',
    badMatches: 'Rat, Rabbit, Horse, Rooster, Dog'

},
{
    sign: 'Dog',
    year: [1922, 1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030],
    image: 'img/dog.png',
    strength: 'Valiant, loyal, responsible, clever, courageous, lively',
    weakness: 'Sensitive, conservative, stubborn, emotional',
    bestMatches: 'Rabbit',
    badMatches: 'Dragon, Sheep, Rooster'
},
{
    sign: 'Pig',
    year: [1923, 1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031],
    image: 'img/pig.png',
    strength: 'Warm-hearted, good-tempered, loyal, honest, gentle',
    weakness: 'Naive, gullible, sluggish, short-tempered',
    bestMatches: 'Tiger, Rabbit, Sheep',
    badMatches: 'Snake, Monkey'
}
]

console.log(chineseZodiac)

function getZodiac() {
    var x = document.getElementById('zodiac').value
    console.log(x)
    for(var i = 0; i < chineseZodiac.length; i++) {
        for(var j = 0; j < chineseZodiac[i].year.length; j++){
            if(x == chineseZodiac[i].year[j]){
            document.getElementById('scrolldown').innerHTML = 'Scroll Down To See Your Results '
            document.getElementById('zodiacname').innerHTML = 'Sign: ' + chineseZodiac[i].sign
            document.getElementById('zodiacyear').innerHTML = 'Year: ' + chineseZodiac[i].year
            document.getElementById('zodiacimage').src = chineseZodiac[i].image
            document.getElementById('zodiacstrength').innerHTML = '<b>Strength</b>: ' + chineseZodiac[i].strength
            document.getElementById('zodiacweakness').innerHTML = '<b>Weakness</b>: ' + chineseZodiac[i].weakness
            document.getElementById('best').innerHTML = '<b>Best Matches are</b>: ' + chineseZodiac[i].bestMatches
            document.getElementById('bad').innerHTML = '<b>Bad Matches are</b>: ' + chineseZodiac[i].badMatches
            return
        }

        else {
            document.getElementById('zodiacname').innerHTML = 'There is no result based on your provided information'
            document.getElementById('zodiacyear').innerHTML = ''
            document.getElementById('zodiacimage').src = ''
            document.getElementById('zodiacstrength').innerHTML = ''
            document.getElementById('zodiacweakness').innerHTML = ''
            document.getElementById('best').innerHTML = ''
            document.getElementById('bad').innerHTML = ''

        }
        }
        
    }


}

