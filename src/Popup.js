import Overlay from './Overlay.js';
import KeyboardMixin from './KeyboardMixin.js';
import PopupModalityMixin from './PopupModalityMixin.js';
import * as symbols from './symbols.js';


const Base =
  KeyboardMixin(
  PopupModalityMixin(
    Overlay
  ));


/**
 * A `Popup` is a lightweight form of overlay that, when opened, displays its
 * children on top of other page elements.
 * 
 * @inherits Overlay
 * @mixes KeyboardMixin
 * @mixes PopupModalityMixin
 */
class Popup extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    const mousedownHandler = async event => {
      this[symbols.raiseChangeEvents] = true;
      await this.close();
      this[symbols.raiseChangeEvents] = false;
      event.preventDefault();
      event.stopPropagation();
    };
    this.$.backdrop.addEventListener('mousedown', mousedownHandler);

    // Mobile Safari doesn't seem to generate a mousedown handler on the
    // backdrop in some cases that Mobile Chrome handles. For completeness, we
    // also listen to touchend. (Since this is only for Safari, we don't need to
    // also listen for the more-standard pointerup event.)
    this.$.backdrop.addEventListener('touchend', mousedownHandler);
  }

}


customElements.define('elix-popup', Popup);
export default Popup;
