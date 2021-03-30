
const Helpers = () => {

    const CreateElement = (element, attributes) => {
        element = document.createElement(element);
        if (attributes) {
            element.className = attributes.className || '';
            element.innerHTML = attributes.innerHTML || '';
        }
        return element;
    }

    return [CreateElement];
}

export default Helpers;