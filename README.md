
# canvas-gamepad

Screen gamepad for HTML canvas games.

It draws a gamepad over your canvas and receives the click or tap events on the buttons and the direction pad (d-pad).

![Screenshot](https://raw.githubusercontent.com/jmaister/canvas-gamepad/master/docs/screenshot.png)

# Features

* Direction pad (d-pad)
* 2 buttons

# Usage

Download with npm:

    npm install canvas-gamepad --save

Having a canvas with id 'c':

    const gamepad = new CanvasGamepad({
        canvasId: 'c'
    });

Then, receive the events when buttons and clicked:

    gamepad.addEventListener((eventData) => {
        console.log(eventData);
    });

'eventData' looks like this:

    {"A":false,"B":false,"up":false,"down":false,"left":true,"right":false}


# TODO

* Draw name/icon over the button
* Predefined number of buttons
* User defined buttons and styles
* Multiple buttons/keep buttons pressed
