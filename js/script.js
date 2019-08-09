'use strict';

const projectCardGrid = document.querySelector('.project-cards-grid');
const nav = document.querySelector('nav');
const requestURL = '../data/data.json';

const request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = processData;

function processData() {
    const data = request.response;
    const projects = data.projects;
    populateProjectsCardGrid(projects);
    populateGlobalNav();
}

function populateProjectsCardGrid(projects) {
    if (projects.length > 0) {
        projects.forEach(project => {
            const projectDiv = createElement('div', projectCardGrid);
            const titleH1 = createElement('h1', projectDiv);
            titleH1.textContent = project.name;
            const categorySpan = createElement(
                'span',
                titleH1,
                'project-category',
            );
            categorySpan.textContent = project.category;
            const clientH2 = createElement('h2', projectDiv);
            clientH2.textContent = project.client;
            const summaryDiv = createElement(
                'div',
                projectDiv,
                'project-summary',
            );
            const summaryPara = createElement('p', summaryDiv);
            summaryPara.textContent = project.summary;
            if (
                project.summarybullets !== undefined &&
                project.summarybullets.length > 0
            ) {
                const summaryBulletUL = createElement('ul', summaryDiv);
                project.summarybullets.forEach(item => {
                    const itemLI = createElement('li', summaryBulletUL);
                    itemLI.textContent = item;
                });
            }
            if (project.link !== undefined) {
                const linkPara = createElement('p', summaryDiv);
                const link = createElement('a', linkPara);
                link.title = 'Application Link';
                link.textContent = 'Application Link';
                link.href = project.link;
                link.target = '_blank';
            }
            if (
                project.technologystack !== undefined &&
                project.technologystack.length > 0
            ) {
                const technologyDiv = createElement(
                    'div',
                    projectDiv,
                    'project-technology',
                );
                const technologyUL = createElement('ul', technologyDiv);
                project.technologystack.forEach(item => {
                    const itemLI = createElement('li', technologyUL);
                    itemLI.textContent = item;
                });
            }
        });
    }
}

function populateGlobalNav() {
    const work = createElement('a', nav);
    work.title = 'Work';
    work.href = '#latest-work';
    work.textContent = 'Work';

    const blog = createElement('a', nav);
    blog.title = 'Blog';
    blog.href = '/blog';
    blog.textContent = 'Blog';

    const contact = createElement('a', nav);
    contact.title = 'Contact';
    contact.textContent = 'Contact';
    contact.href = 'mailto:amit.gupta@arrowts.com';

    const linkedin = createElement('a', nav);
    linkedin.title = 'LinkedIn Profile';
    linkedin.textContent = 'Linkedin';
    linkedin.href = 'https://www.linkedin.com/in/amitgupta15/';
    linkedin.target = '_blank';

    const twitter = createElement('a', nav);
    twitter.title = 'Amit on Twitter';
    twitter.textContent = 'Twitter';
    twitter.href = 'https://twitter.com/amitgupta15';
    twitter.target = '_blank';
}
// Helper functions
function createElement(type, parent, classList) {
    const element = document.createElement(type);
    if (classList !== undefined) {
        typeof classList === 'Array' && classList.length > 0
            ? element.classList.add(...classList)
            : (element.className = classList);
    }
    parent.append(element);
    return element;
}
