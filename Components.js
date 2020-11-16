class SettingBox {

    constructor(label, x, y, isSet, callback) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.isSet = isSet;
        this.callback = callback;
    }

    show() {
        //noFill();
        strokeWeight(1);
        stroke(0);
        noFill();
        ellipse(this.x + 10, this.y + 10, 20, 20);
        if (this.isSet) {
            fill(0);
            ellipse(this.x + 10, this.y + 10, 3, 3);
        }
        fill(0);
        noStroke();
        text(label, this.x + 25, this.y + 15);
    }

    mouseClick(x, y) {
        if (x > this.x && x <= this.x + 20 &&
            y > this.y && y <= this.y + 20) {
            this.isSet = !this.isSet;
            if (this.callback != null)
                this.callback(this);
        }
    }

}


class Button {
    constructor(label, x, y, w, h, callback) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.callback = callback;
    }

    show() {
        stroke(0);
        strokeWeight(1);
        noFill();
        rect(this.x, this.y, this.w, this.h);
        fill(0);
        noStroke();
        text(this.label, this.x + 5, this.y + 5, this.w - 10, this.h - 10);
    }

    mouseClick(x, y) {
        if (this.callback != null &&
            x > this.x && x <= this.x + this.w &&
            y > this.y && y <= this.y + this.h) {
            this.callback(this);
        }
    }
}
