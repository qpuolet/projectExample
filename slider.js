let Slider = {
  config: {
    slideCount: 0,
    prevSlide: null,
    curSlide: 0,
    nextSlide: null,
    autoFlip: false,
    coordXDown: 0,
    coordXUp: 0,

  },

  initArrows() {
    this.prevArrow = document.createElement('button');
    this.prevArrow.className = 'slider__arrowLeft';
    this.prevArrow.innerHTML = '<i class="fa fa-chevron-left fa-lg" aria-hidden="true"></i>';
    this.prevArrow.onclick = this.prevSlide.bind(this);

    this.nextArrow = document.createElement('button');
    this.nextArrow.className = 'slider__arrowRight';
    this.nextArrow.innerHTML = '<i class="fa fa-chevron-right fa-lg" aria-hidden="true"></i>';
    this.nextArrow.onclick = this.nextSlide.bind(this);

    const fragment = document.createDocumentFragment();
    fragment.appendChild(this.prevArrow);
    fragment.appendChild(this.nextArrow);

    this.node.appendChild(fragment);

  },

  initMouseHandlers() {
    this.node.onmousedown = this.mouseDown.bind(this);
    this.node.onmouseup = this.mouseUp.bind(this);
    this.node.ontouchstart = this.touchDown.bind(this);
    this.node.ontouchend = this.touchUp.bind(this);

    if(this.config.autoFlip) {
      this.node.onmouseout = this.flipSlides.bind(this);
      this.node.onmouseover = this.stopFlippingSlides.bind(this);
    }

  },

  nextSlide() {
    // changing prevSlide index
    this.config.prevSlide = this.config.curSlide;

    // changing curSlide index
    if(this.config.curSlide === this.config.slideCount) {
      this.config.curSlide = 0;
    } else {
      this.config.curSlide +=1;
    }

    // changing nextSlide index
    if(this.config.curSlide + 1 <= this.config.slideCount) {
      this.config.nextSlide = this.config.curSlide + 1;
    } else {
      this.config.nextSlide = 0;
    }

    this.goToSlide(this.config.curSlide);

  },

  prevSlide() {
    // changing nextSlide index
    this.config.nextSlide = this.config.curSlide;

    // changing curSlide index
    if(this.config.curSlide === 0) {
      this.config.curSlide = this.config.slideCount;
    } else {
      this.config.curSlide -= 1;
    }
    // changing prevSlide index

    if(this.config.curSlide - 1 >= 0) {
      this.config.prevSlide = this.config.curSlide - 1;
    } else {
      this.config.prevSlide = this.config.slideCount;
    }

    this.goToSlide(this.config.curSlide);

  },

  mouseDown() {
    this.config.coordXDown = event.clientX;
  },

  mouseUp() {
    this.config.coordXUp = event.clientX;
    this.swipe();

  },

  touchDown() {
    this.config.coordXDown = event.touches[0].clientX;

  },

  touchUp() {
    this.config.coordXUp = event.changedTouches[0].clientX;
    this.swipe();

  },

  swipe () {
    let swipeX = this.config.coordXDown - this.config.coordXUp;

    let swipeSize = 120;
    if (window.matchMedia("(max-width: 480px)").matches) swipeSize = 60;

    if (swipeX < 0 && swipeX < -swipeSize) { this.prevSlide()}
    if(swipeX > 0 && swipeX > swipeSize) { this.nextSlide() }

  },

  initSlide() {
    let curSlide = Array.from(this.node.getElementsByClassName('sliderItem'))[this.config.curSlide];
    curSlide.classList.add("sliderItem__initSlider", "sliderItem__showSlide");
  },

  flipSlides() {
    this.flipInterval = setInterval(() => this.nextSlide(), 5000);
  },

  stopFlippingSlides() {
    clearInterval(this.flipInterval);

  },

  init(node, config) {
    this.config = Object.assign({}, this.config, config || {});
    this.config.slideCount = node.children.length - 1;
    if (this.config.slideCount < 1) return;
    
    this.node = node;
    node.Slider = this;
    
    this.initSlide();
    this.initArrows();
    this.initMouseHandlers();
    if(this.config.autoFlip) this.flipSlides();

  },

  goToSlide(x) {
    let curSlide = Array.from(this.node.getElementsByClassName('sliderItem'));
    curSlide.forEach(slide => slide.classList.remove('sliderItem__showSlide'));
    curSlide[x].classList.add('sliderItem__showSlide');
  },

};

Array.prototype.forEach.call(document.querySelectorAll('.postPreview__slidesList'), (node) => {
  Object.create(Slider).init(node, {autoFlip: true, curSlide: 1});
});