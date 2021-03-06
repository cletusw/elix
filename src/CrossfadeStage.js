import { merge } from './updates.js';
import Modes from './Modes.js';


/**
 * Like [Modes](Modes), this shows a single item at a time. It displays a
 * crossfade effect when transitioning between items.
 * 
 * @inherits Modes
 */
class CrossfadeStage extends Modes {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    // Once everything's finished rendering, enable transition effects.
    setTimeout(() => {
      this.setState({
        enableTransitions: true
      });
    });
  }

  get defaultState() {
    // Suppress transition effects on page load.
    return Object.assign({}, super.defaultState, {
      enableTransitions: false,
      transitionDuration: 750 // 3/4 of a second
    });
  }

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates(item, calcs, original);
    const selectedIndex = this.selectedIndex;
    const swiping = this.state.swipeFraction != null;
    const swipeFraction = this.state.swipeFraction || 0;
    const selectionFraction = -swipeFraction;
    const opacity = opacityForItemWithIndex(calcs.index, selectedIndex, selectionFraction);
    const showTransition = this.state.enableTransitions && !swiping;
    const transitionDuration = this.state.transitionDuration / 1000;
    const transition = showTransition ? `opacity ${transitionDuration}s linear` : '';
    return merge(base, {
      style: {
        'display': '', /* override base */
        'grid-column': 1,
        'grid-row': 1,
        opacity,
        transition
      }
    });
  }

  get swipeFraction() {
    return this.state.swipeFraction;
  }
  set swipeFraction(swipeFraction) {
    this.setState({ swipeFraction });
  }

  get transitionDuration() {
    return this.state.transitionDuration;
  }
  set transitionDuration(transitionDuration) {
    this.setState({ transitionDuration });
  }

  get updates() {
    return merge(super.updates, {
      $: {
        modesContainer: {
          style: {
            display: 'grid'
          }
        }
      }
    });
  }

}


function opacityForItemWithIndex(index, selectedIndex, selectionFraction) {
  const opacityMinimum = 0;
  const opacityMaximum = 1;
  const opacityRange = opacityMaximum - opacityMinimum;
  const fractionalIndex = selectedIndex + selectionFraction;
  const leftIndex = Math.floor(fractionalIndex);
  const rightIndex = Math.ceil(fractionalIndex);
  let awayIndex = selectionFraction >= 0 ? leftIndex : rightIndex;
  let towardIndex = selectionFraction >= 0 ? rightIndex : leftIndex;
  const truncatedSwipeFraction = selectionFraction < 0 ? Math.ceil(selectionFraction) : Math.floor(selectionFraction);
  const progress = selectionFraction - truncatedSwipeFraction;
  const opacityProgressThroughRange = Math.abs(progress) * opacityRange;

  let opacity;
  if (index === awayIndex) {
    opacity = opacityMaximum - opacityProgressThroughRange;
  } else if (index === towardIndex) {
    opacity = opacityMinimum + opacityProgressThroughRange;
  } else {
    opacity = opacityMinimum;
  }

  return opacity;
}


customElements.define('elix-crossfade-stage', CrossfadeStage);
export default CrossfadeStage;
