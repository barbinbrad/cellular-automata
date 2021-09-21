# Cellular Automata

[Demo: http://barbinbrad.github.io/cellular-automata/](http://barbinbrad.github.io/cellular-automata/)

A full-screen canvas implementation of cellular automata.

### Settings

To use your own images and use your own rules, modify the settings.

```
const YOUR_SETTINGS = {
  Birth: [0,1,1,1,0,0,0,0], // Stays alive if 2, 3, or 4 neighbors
  Death: [0,0,1,0,0,0,0,0], // Comes back to life if 3 neighbors
  ImageWidth: 1024, // Height of original image
  ImageHeight: 1024, // Width of original image
  ImagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Westinghouse_Logo.svg/1024px-Westinghouse_Logo.svg.png',  
  DarkImage: true, // Dead is black in DarkMode
  GrayScale: false, // No color used if GrayScale
};

const settings = YOUR_SETTINGS;
```


### Credits

Oliver Krill: [http://people.math.harvard.edu/~knill//technology/ca/23-36.html](http://people.math.harvard.edu/~knill//technology/ca/23-36.html
)
