// src/screens/SupportContentScreen.js

// Dummy data for support content
const supportContentData = {
    supportContentGrief: {
        topicId: "sc1",
        header: "Acknowledging Your Grief",
        illustration: "illustration-heart", // Can be more specific if needed
        content: [
            { type: "p", text: "Grief is a natural response to loss. It’s the emotional suffering you feel when something or someone you love is taken away. You might experience all kinds of difficult and unexpected emotions, from shock or anger to disbelief, guilt, and profound sadness." },
            { type: "p", text: "There is no 'right' or 'wrong' way to grieve. How you grieve depends on many factors, including your personality and coping style, your life experience, your faith, and how significant the loss was to you." },
            { type: "p", text: "Be patient with yourself and allow the grieving process to naturally unfold." }
        ]
    },
    supportContentChildren: {
        topicId: "sc3",
        header: "Supporting Your Children",
        illustration: "illustration-children-support",
        content: [
            { type: "p", text: "You and your wife are navigating your own grief while supporting your children. Remember that an 8-year-old and a 5-year-old will process this loss very differently." },
            { type: "h3", text: "Key Considerations:"},
            { type: "ul", items: [
                "<strong>Be Patient:</strong> Their grief may come in waves and can look like anger, confusion, or withdrawal.",
                "<strong>Be Honest:</strong> Answer their questions in an age-appropriate way. Use clear language (e.g., 'died' instead of 'passed away' or 'is sleeping').",
                "<strong>Maintain Routines:</strong> As much as possible, stick to familiar routines for school and bedtime to provide a sense of security.",
                "<strong>Seek Resources:</strong> Consider books about grief for children or connecting with a school counselor or children's grief specialist if you feel it would be helpful."
            ]},
            { type: "p", text: "Reassure them that they are loved and that you will get through this together."}
        ]
    },
    // Add more content for other topics...
    supportContentHelp: {
        topicId: "sc2",
        header: "Accepting Help from Others",
        illustration: "illustration-hands",
        content: [{type: "p", text: "It's okay to accept help. People want to support you. Let them."}]
    },
    supportContentPatience: {
        topicId: "sc4",
        header: "Being Patient with the Process",
        illustration: "illustration-path",
        content: [{type: "p", text: "Grief takes time. There is no set schedule. Be kind to yourself."}]
    }
};
window.supportContentData = supportContentData; // Make global for now

export function renderSupportContentScreen(contentKey, topicId, container, transitionType) { // Added export
    const content = window.supportContentData[contentKey]; // Use global

    if (!content) {
        container.innerHTML = `<p>Error: Support content not found for ${contentKey}.</p><button onclick="window.loadScreen('selfCareHub')">Back to Hub</button>`;
        return;
    }

    let articleHtml = '';
    content.content.forEach(item => {
        if (item.type === 'p') {
            articleHtml += `<p>${item.text}</p>`;
        } else if (item.type === 'h3') {
            articleHtml += `<h3>${item.text}</h3>`;
        } else if (item.type === 'ul') {
            articleHtml += '<ul>';
            item.items.forEach(li => articleHtml += `<li>${li}</li>`);
            articleHtml += '</ul>';
        }
    });

    const screenContainerId = contentKey + 'Screen';
    // Determine the element to render into. If container is root, create the screen div.
    // If container is a pre-made slide-in div, populate it.
    let screenElement;
    if (container.id === 'root' && transitionType !== 'slide-in') { // Only create if not sliding into a temp container
        container.innerHTML = `<div class="support-content-screen" id="${screenContainerId}"></div>`;
        screenElement = container.firstChild;
    } else { // Assumes container is the slide-in div prepared by app.js or direct root for non-slide
        container.innerHTML = ''; // Clear it first
        container.id = screenContainerId;
        container.classList.add('support-content-screen');
        screenElement = container;
    }

    screenElement.innerHTML = `
        <header class="support-content-header">
            <a href="#" class="back-button-icon" id="backToHubButton">&lt;</a>
            <h2>${content.header}</h2>
        </header>
        <article class="support-content-article">
            <span class="article-illustration ${content.illustration || ''}"></span>
            ${articleHtml}
        </article>
    `;

    if (transitionType === 'slide-in' && screenElement.classList.contains('screen-slide-in')) {
        void screenElement.offsetWidth; // Trigger reflow
        screenElement.classList.add('active');
    }


    // Event Listeners
    screenElement.querySelector('#backToHubButton').addEventListener('click', (e) => {
        e.preventDefault();
        if (screenElement.classList.contains('screen-slide-in') && screenElement.classList.contains('active')) {
            screenElement.classList.remove('active');
            setTimeout(() => {
                screenElement.remove(); // Remove the slide-in div itself
                window.loadScreen('selfCareHub', { transition: 'slide-in' }); // SelfCareHub slides back in
            }, 500);
        } else {
            window.loadScreen('selfCareHub');
        }
    });
}
