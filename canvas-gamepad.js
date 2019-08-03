
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInPath
// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
// future: http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html

// coordinates: https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/20788872#20788872


class Utils {
    static time() {
        return new Date().getTime();
    }

    static dpad(w, h) {
        return [
            {name:'up',    x:w,   y:0,   w: h, h: w, counter: Utils.time()},
            {name:'down',  x:w,   y:w+h, w: h, h: w, counter: Utils.time()},
            {name:'left',  x:0,   y:w,   w: w, h: h, counter: Utils.time()},
            {name:'right', x:w+h, y:w,   w: w, h: h, counter: Utils.time()},
        ];
    }

    static defaultConfig() {
        const dpadw = 54;
        const dpadh = 54;
        const buttonRadius = 44;
        return {
            buttons: [
                {name:'A', x:0, y:0, r: buttonRadius, color:'blue', border:'darkblue', clickcolor: 'yellow', counter: Utils.time()},
                {name:'B', x:0, y:0, r: buttonRadius, color:'red', border:'darkred', clickcolor: 'green', counter: Utils.time()},
            ],
            buttonRadius,
            // w,h of left button
            dpadw,
            dpadh,
            dpad: Utils.dpad(dpadw, dpadh),
            lineWidth: 4,
            clickWidth: 44,
            animationMs: 100
        };
    }
}

class CanvasGamepad {
   
    constructor(config) {
        // Configuration
        this.config = Object.assign({}, Utils.defaultConfig(), config);

        if (!this.config.canvasId) {
            throw new Error("'canvasId' parameter must be defined.")
        }

        // Initialize
        this.canvas = document.getElementById(this.config.canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.listeners = [];
        this.refresh();

        const eventData = {};

        // Setup event listener
        const allButtons = this.config.buttons.concat(this.config.dpad);
        this.canvas.addEventListener('click', event => {
            // console.log('evt offset', event.offsetX, event.offsetY);

            allButtons.forEach(button => {
                if (this.ctx.isPointInPath(button.path, event.offsetX, event.offsetY)
                    || this.ctx.isPointInStroke(button.path, event.offsetX, event.offsetY)) {
                    button.counter = Utils.time() + this.config.animationMs;
                    eventData[button.name] = true;
                } else {
                    eventData[button.name] = false;
                }
            });

            this.listeners.forEach(listener => {
                listener(eventData, event);
            })
        }, false);
        
        // Ask for first draw
        window.requestAnimationFrame(() => this.draw());
    }

    addEventListener(callback) {
        this.listeners.push(callback);
    }

    refresh() {
        // Draw d-pad. Adjust pad to BOTTOM-LEFT
        const dx = this.config.lineWidth
            + (this.config.clickWidth/2);
        const dy = this.canvas.height
            - (this.config.lineWidth + this.config.dpadh + (this.config.dpadw*2))
            - (this.config.clickWidth/2);
        this.config.dpad.forEach(d => {
            const box = new Path2D();
            box.rect(d.x + dx, d.y + dy, d.w, d.h);
            d.path = box;
        });

        // Draw buttons. Adjust pad to BOTTOM-RIGHT
        let ddx = this.canvas.width
            - this.config.lineWidth
            - this.config.buttonRadius;
        let ddy = this.canvas.height
            - this.config.lineWidth
            - (this.config.buttonRadius * 3);
        this.config.buttons.forEach(button => {
            const circle = new Path2D();
            circle.arc(button.x + ddx, button.y + ddy, button.r, 0, 2 * Math.PI);
            button.path = circle;

            ddx = ddx - (button.r * 1.25) - this.config.clickWidth;
            ddy = ddy + (this.config.buttonRadius * 2);
        });
    }

    draw() {
        const u = Utils.time();
        const ctx = this.ctx;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); 

        this.config.buttons.forEach(button => {
            if (button.counter > u) {
                ctx.fillStyle = button.clickcolor;
            } else {
                ctx.fillStyle = button.color;
            }
            ctx.fill(button.path);
            ctx.strokeStyle = button.border;
            ctx.lineWidth = this.config.lineWidth;
            ctx.stroke(button.path);
        });
    
        this.config.dpad.forEach(direction => {
            if (direction.counter > u) {
                ctx.fillStyle = 'green';
            } else {
                ctx.fillStyle = 'lightgray';
            }
            ctx.fill(direction.path);
            ctx.lineWidth = this.config.lineWidth;
            ctx.strokeStyle = 'gray';
            ctx.stroke(direction.path);
        });

        window.requestAnimationFrame(() => this.draw());
    }    
}
