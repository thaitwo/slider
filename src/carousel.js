import './scss/style.scss';
import $ from 'jquery';
import _ from 'lodash';

class Slider {
  constructor({ imageLinks = [], breadcrumb = true, arrows = true, autoplay = true }) {
    this.$container = $('#carousel');
    this.$breadcrumbContainer;
    this.$breadcrumbs;
    this.$nextArrow;
    this.nextIndex;
    this.$prevArrow;
    this.currentIndex = 0;
    this.prevIndex;
    this.$images;

    // If image links array is passed, use array
    if (imageLinks.length) {
      this.imageLinks = imageLinks;
    }
    // If not passed, search for images and create array of links
    else {
      this.imageLinks = _.map($('#carousel img'), image => image.src);
    }

    this.count = this.imageLinks.length;

    this.renderSlides();

    if (breadcrumb === true) {
      this.renderBreadcrumb();
    }
    // Make first breadcrumb active on load
    this.updateBreadcrumbState(0);

    if (arrows === true) {
      this.renderNavigationArrows();
    }

    this.activateKeyboardArrows();
  }


  // RENDER IMAGE SLIDES INTO CAROUSEL CONTAINER
  renderSlides() {
    this.$container.empty();

    let slides = this.imageLinks.map((link, index) => {
      // if slide is first in gallery, add active class
      let slideClass = (index === 0) ? 'slide active' : 'slide';

      return `<div class="${slideClass}" style="background-image: url('${link}');"></div>`;
    });

    this.$container.append(slides);
    this.$images = this.$container.find('.slide');
  }


  // RENDER BREADCRUMB NAVIGATION
  renderBreadcrumb() {
    this.$container.append('<nav class="carousel-breadcrumb pause-autoplay"></nav>');
    this.$breadcrumbContainer = $('.carousel-breadcrumb');

    for (var i = 0; i < this.count; i++) {
      this.$breadcrumbContainer.append(`<li id="${i}"></li>`);
    }

    this.$breadcrumbs = this.$breadcrumbContainer.find('li');
    this.activateBreadcrumb();
  }


  // ACTIVATE BREADCRUMB NAVIGATION
  activateBreadcrumb() {
    this.$breadcrumbContainer.on('click', 'li', (event) => {
      event.stopPropagation();
      let id = event.target.id;
      this.updateBreadcrumbState(id);
    });
  }


  // UPDATE BREADCRUMB STYLE
  updateBreadcrumbState(id) {
    this.$breadcrumbs.removeClass('active');
    let clicked = this.$breadcrumbContainer.find(`#${id}`);
    clicked.addClass('active');
  }


  // RENDER NAVIGATION ARROWS
  renderNavigationArrows() {
    this.$container.append(`
      <button id="next" class="carousel-arrow right pause-autoplay">
        <i class="fa fa-angle-right fa-5x" aria-hidden="true"></i>
      </button>
      <button id="prev" class="carousel-arrow left pause-autoplay">
        <i class="fa fa-angle-left fa-5x" aria-hidden="true">
      </i></button>
    `);

    this.$nextArrow = $('#next');
    this.$prevArrow = $('#prev');

    this.activateNavigationArrows();
  }


  // ACTIVATE EVENT LISTENER ON ARROWS
  activateNavigationArrows() {
    this.$nextArrow.on('click', (event) => {
      event.stopPropagation();
      this.nextImage();
    });

    this.$prevArrow.on('click', (event) => {
      event.stopPropagation();
      this.prevImage();
    });
  }


  // GET NEXT SLIDE
  nextImage() {
    this.removeCurrentSlide(this.$images[this.currentIndex], 'next');
    // if current index is last in gallery, set next index to first in gallery
    if (this.currentIndex === this.count - 1) {
      this.nextIndex = 0;

      this.currentIndex = this.nextIndex;
    }
    else {
      this.nextIndex = this.currentIndex + 1;
      this.currentIndex = this.nextIndex;
    }

    this.showSlide(this.$images[this.nextIndex], 'next');
    this.updateBreadcrumbState(this.nextIndex);
  }


  // GET PREVIOUS SLIDE
  prevImage() {
    this.removeCurrentSlide(this.$images[this.currentIndex]);
    // if current index is first in gallery, set prev index to last in gallery
    if (this.currentIndex === 0) {
      this.prevIndex = this.count - 1;
      this.currentIndex = this.prevIndex;
    }
    else {
      this.prevIndex = this.currentIndex - 1;
      this.currentIndex = this.prevIndex;
    }

    this.showSlide(this.$images[this.prevIndex], 'prev');
    this.updateBreadcrumbState(this.prevIndex);
  }


  // REMOVE CURRENT SLIDE
  removeCurrentSlide(slide, direction) {
    if (direction === 'next') {
      $(slide).addClass('left');
    }
    else {
      $(slide).addClass('right');
    }

    setTimeout(() => {
      $(slide).removeClass('active right left');
    }, 1000);
  }


  // SHOW NEXT/PREV SLIDE
  showSlide(slide, direction) {
    if (direction === 'next') {
      $(slide).addClass('next');
    }
    else {
      $(slide).addClass('prev');
    }

    setTimeout(() => {
      $(slide).removeClass('next prev');
      $(slide).addClass('active');
    }, 1000);
  }


  // ACTIVATE KEYBOARD ARROWS
  activateKeyboardArrows() {
    $(document).keydown(event => {
      switch(event.keyCode) {
        case 37:
          event.preventDefault();
          this.prevImage();
          break;
        case 39:
          event.preventDefault();
          this.nextImage();
          break;
      }
    });
  }
}


// CREATE NEW SLIDER
new Slider({
  imageLinks: [
    '../images/snow.jpg',
    '../images/valley.jpg',
    '../images/mountains.jpg',
    '../images/sunset.jpg',
    '../images/river.jpg'
  ],
  breadcrumb: true,
  arrows: true,
  autoplay: false
});