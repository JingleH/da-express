import { getLibs, fixIcons, createTag } from '../../scripts/utils.js';
import { determineTemplateXType, determineTemplateXTypeFromProps } from './../template-x/determine-template-x-type.js'
import { createRichTextInput } from './rich-text-input.js';

export const PROPS = {
    header : {
        contentRow : true, 
        value : undefined
    },
    limit: 20, 
    collectionId: 'urn:aaid:sc:VA6C2:25a82757-01de-4dd9-b0ee-bde51dd3b418',
    loadedOtherCategoryCounts: false,
    tasks : '',
    topics : '',
    locales : 'en',
    toolBar: { 
        allowed : [false, true]
    },
    searchBar: { 
        allowed : [false, true]
    },
    behaviors :{
        allowed :  ['still', 'animated', 'all'],
    },
    premium : {
        allowed : [true, false, 'all']
    },
    animated: {
        allowed : [true, false, 'all']
    },
    templateStats : {
        allowed :  ['still', 'animated', 'all'],
    },
    loadMoreTemplates: {
        allowed : [true, false]
    },
    orientation : {
        allowed : ['horizontal','vertical']
    },
    width : {
        allowed : ['full','sixcols','fourcols', 'std']
    },
    mini : {
        allowed : [false, true]
    },
    
    Q : '',
    Sort : '',
    print : {
        allowed : [
           'none', 'flyer', 't-shirt', ''
        ]
    },
    
    

};
function setValueByKeyPath(obj, keyPath, value) {
    let current = obj
    for (let i = 0; i < keyPath.length - 1; i++) {
        current = current[keyPath[i]]
    }
    if (! value || value === 'none') {
        delete   current[keyPath[keyPath.length - 1]]
    } else {
        current[keyPath[keyPath.length - 1]] = value
    }
   
}

async function createInputFields(current, keyPath, output, sourceOfTruth, parentContainer) {
    if (typeof current === 'object') {
        if (current.contentRow) { 
            const richTextInput = await createRichTextInputField(current)
            parentContainer.appendChild(richTextInput)
        } else if (current.allowed) {
            output.push(createRestrictedInputfield(current, keyPath, sourceOfTruth, parentContainer))
        } else {
            Array.from(Object.keys(current)).forEach(key => {
                const divider = createTag('div', { class: 'divider' })
                divider.textContent = key
                parentContainer.appendChild(divider)
                const newFields = [...keyPath, key]
                createInputFields(current[key], newFields, output, sourceOfTruth, divider)
            });

        }
    } else {
        output.push(createBasicInputField(current, keyPath, sourceOfTruth, parentContainer))
    }

    return output
}

function createRestrictedInputfield(current, keyPath, sourceOfTruth, parentContainer) {
    const allowed = current.allowed
    const wrapper = createTag('div', { class: 'input-field-wrapper' })
    const div = createTag('select')
    allowed.forEach((entry) => {
        const option = createTag('option')
        option.innerText = entry;
        div.appendChild(option)
    })
    wrapper.appendChild(div)
    createHandlerEvent(div, keyPath, sourceOfTruth)
    setValueByKeyPath(sourceOfTruth, keyPath, allowed[0])
    parentContainer.appendChild(wrapper)

}

function createHandlerEvent(inputElement, keyPath, sourceOfTruth) {
    inputElement.addEventListener('blur', (e) => {
        setValueByKeyPath(sourceOfTruth, keyPath, e.target.value)
    })
}

function createBasicInputField(current, keyPath, sourceOfTruth, parentContainer) {
    const wrapper = createTag('div', { class: 'input-field-wrapper' })
    const input = createTag('input', { class: 'input-field' })
    input.setAttribute('type', typeof current)
    input.setAttribute('value', current)
    wrapper.appendChild(input)
    createHandlerEvent(input, keyPath, sourceOfTruth)
    parentContainer.appendChild(wrapper)
}
 
 
function copyToClipboard(html) {
    const listener = function (e) {
        e.clipboardData.setData('text/html', html);
        e.clipboardData.setData('text/plain', html);
        e.preventDefault();
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
    console.log('Table copied to clipboard! Now you can paste it in SharePoint.');
} 

function createHTMLTable (blockName, variants = [],sourceOfTruth) { 
    let block = createTag('div' , { class : blockName})
    Object.entries(sourceOfTruth).forEach(entry => {
        const row = createTag('div')
        if (entry[1].contentRow) {
            row.innerHTML = entry[1].value
        } else {
            entry.forEach(cell => {
                const col = createTag('div')
                col.textContent = cell
                row.appendChild(col)
            });
          
        }
        block.appendChild(row)
    });
    return block
}

function createSharePointTable(blockName, variants = [],sourceOfTruth) { 
    let tableHtml = '<table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse;">';
    tableHtml += '<thead><tr>';
    tableHtml += `<th>${blockName} (${variants.map((variant) => ` ${variant}`)}) </th>`;
    tableHtml += '</tr></thead>';
    tableHtml += '<tbody>'; 
    Object.entries(sourceOfTruth).forEach(entry => {
        tableHtml += '<tr>';
        if (entry[1].contentRow) {
            tableHtml += `<td>${entry[1].value}</td>`;
        } else {
            entry.forEach(cell => {
                tableHtml += `<td>${cell}</td>`;
            });
        }
     
        tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';
    return tableHtml;
}

async function createRichTextInputField(contentRow) {
    const richTextInput = await createRichTextInput();
    const editor = richTextInput.querySelector(".editor");
    
    // Fix: Correct event listener structure
    editor.addEventListener('blur', (e) => {
        contentRow.value = e.target.innerHTML;
    });
    
    return richTextInput;
}

function createDownloadButton(block, previewContainer, sourceOfTruth) {
    const button = createTag('button')
    button.textContent = "Copy To Clipboard"
    button.addEventListener('click', () => {
        copyToClipboard(createSharePointTable('template-x', ['variant1, variant2'], sourceOfTruth))
        preview(previewContainer, sourceOfTruth)
    })
    block.appendChild(button)
}

async function preview (previewContainer, sourceOfTruth) {
    previewContainer.innerHTML = ''
    const table = createHTMLTable('template-x', ['variant1, variant2'], sourceOfTruth)
    const {default: decorate} = await import("./../template-x/template-x.js")
    previewContainer.appendChild(table)
    decorate(table)

}

export default async function decorate(block) {
    const sourceOfTruth = { ...PROPS }
    const output = []
    const previewContainer = createTag('div', {class : 'preview-container'})
    const authoringToolWidget = createTag('div', {class : 'authoring-tool-widget'})
    block.appendChild(authoringToolWidget)
    block.appendChild(previewContainer)
    await createInputFields({ ...PROPS }, [], output, sourceOfTruth, authoringToolWidget)
    createDownloadButton(authoringToolWidget, previewContainer, sourceOfTruth)
  

}