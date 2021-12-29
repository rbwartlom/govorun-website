//get data from csv through papaparse


const source = "http://127.0.0.1:8887/schedule.csv";
Papa.parse(source, {
    download: true,
    header: true,
    complete: function(results) {
        generateElements(results.data);
        generateFilter(results.data)
    }
}
)

function generateFilter(data)
{
    // excel data : title name
    var possibleStudentTypes ={
        "дошк" : "Дошкольники",
        "школьн" : "Школьники",
        "РКИ" : "РКИ (русский как иностранный)",
        "МиМ" : "Мама и малыш"
    }

    var offlineSelectors = {};
    var onlineSelectors = {};

    var offlineParent = document.getElementById("selectListOffline");
    var onlineParent = document.getElementById("selectListOnline");

    //adds all possible student data to Selector objects
    for (let i = 0; i < data.length; i++)
    {
        let currentRow = data[i];
        let studentType = currentRow.student_type;
        let currentAge = currentRow.age;
        let selectors = offlineSelectors
        if (currentRow.online == "TRUE") selectors = onlineSelectors;
        
        if (!(studentType in selectors)) selectors[studentType] = [];

        if (!(selectors[studentType].includes(currentAge))) selectors[studentType].push(currentAge);
    }
    console.log(onlineSelectors);
    console.log(offlineSelectors);
    createFilter(offlineSelectors, offlineParent, possibleStudentTypes);
    createFilter(onlineSelectors, onlineParent, possibleStudentTypes);
    
}

function createFilter(selectorData, parent, studentTypeNames)
{
    for (const key in selectorData)
    {
        //create subtitle
        let subtitle = createDiv("timetableSelect__subtitle", parent);
        subtitle.classList.add("timetableSelect__subtitle_" + key);
        subtitle.innerHTML = studentTypeNames[key];
        //sort array of possible ages for group
        let possibleAges = selectorData[key];
        possibleAges.sort;
        console.log (key, possibleAges);
        //create html elements which will be clicked and used as filters 
        for (let i = 0; i < possibleAges.length; i++)
        {
            buttonLabel = document.createElement("label");
            buttonLabel.classList.add("timetableSelect__option", "timetableSelectOption");
            subtitle.insertAdjacentElement('afterend', buttonLabel);
                //inside buttonLabel there is a hiden input and a div storing the data which is visible to user
                let input = document.createElement("input");
                input.classList.add('visually-hidden');
                input.setAttribute('type', 'checkbox');
                input.setAttribute('name', (key + ':' + possibleAges[i]));
                input.setAttribute('data-element-input', '');

                let buttonDiv = createDiv("timetableSelectOption__button");
                    buttonDiv.innerHTML = '<svg width="24" height="24"><use xlink:href="icons/sprite.svg#done"></use></svg>';
                    let contentSpan = document.createElement('span');
                    contentSpan.innerHTML = possibleAges[i];
                    buttonDiv.append(contentSpan);
                buttonLabel.append(input, buttonDiv);
        }   
    }
}

function generateElements(data)
{
    var createdBlocksOffline = {};
    var createdBlocksOnline = {}; //error because shared object for online and offline
    //loops through data row by row
    for (let i = 0; i < data.length; i++)
    {
        var currentRow = data[i];
        var groupName = currentRow.group;

    let createdBlocks = createdBlocksOffline;
    if(currentRow.online == "TRUE") createdBlocks = createdBlocksOnline;

        if (!(groupName in createdBlocks))
        {
            //sets timetable block element (nests all other elements of current element)
            var timetableBlock = document.createElement("div");
            timetableBlock.classList.add("timetable__block", "timetableBlock", "timetableBlock_" + currentRow.student_type, "open", "js-timetable-block");
            //find alternative to preschoolers
            timetableBlock.setAttribute("data-group", currentRow.student_type);
            timetableBlock.setAttribute("data-class", currentRow.age);
            
            //gets element where to put generated class (online/offline)
            var isOnline = "online";
            if (currentRow.online == "FALSE") isOnline = "offline";
            var containerElement = document.querySelector("section.timetable__tabElement[data-name='" + isOnline + "']");
            containerElement.appendChild(timetableBlock);

                //creates button
                let button = document.createElement("button");
                button.classList.add("timetableBlock__button");
                button.setAttribute("type", "button");
                button.setAttribute("data-element-button", "");
                timetableBlock.append(button);

                    let buttonGroupName = document.createElement("div");
                    buttonGroupName.classList.add("timetableBlock__group");
                    buttonGroupName.innerHTML =currentRow.age;

                    let buttonTitle = document.createElement("div");
                    buttonTitle.classList.add("timetableBlock__title");
                    buttonTitle.innerHTML = groupName;
                    button.innerHTML = '<svg width="24" height="24"><use xlink:href="icons/sprite.svg#arrow"></use></svg>';
                    button.append(buttonGroupName, buttonTitle);

                //creates content container of element (class timetableBlock__content)
                var contents = document.createElement("div");
                contents.classList.add("timetableBlock__content");
                contents.setAttribute("data-element-content", "");
                timetableBlock.append(contents);
            createdBlocks[groupName] = contents;
        }

        

        //adds line containing content to currentRow
        var tableLine = createDiv("timetableBlock__line", createdBlocks[groupName]);

            //creates date and time content of element
            let dateContainer = createDiv("timetableBlock__date", tableLine);
                let dateDay = createDiv('timetableBlock__day', dateContainer);
                dateDay.innerHTML = currentRow.day;
                let dateTime = createDiv('timetableBlock__time', dateContainer);
                dateTime.innerHTML = (currentRow.start_time + " - " + currentRow.end_time);

            //creates info content of element
            let infoContainer = createDiv('timetableBlock__info', tableLine);
                let infoLesson = createDiv('timetableBlock__lesson', infoContainer);
                infoLesson.innerHTML = ('<span>' + currentRow.subject + '</span>');

                let infoTeacher = createDiv('timetableBlock__teacher', infoContainer);
                infoTeacher.innerHTML = ('<span>' + currentRow.teacher + '</span>');

                let infoRoom = createDiv('timetableBlock__room', infoContainer);
                infoRoom.setAttribute("data-title", currentRow.room);
                let roomColorClass = "timetableBlock__room_" + currentRow.room.replace(/\s/g, '-').toLowerCase();
                infoRoom.classList.add(roomColorClass);
                infoRoom.innerHTML = ('<span>' + currentRow.room + '</span>');

                if (currentRow.online == "FALSE")
                {
                    let infoLocation = createDiv('timetableBlock__location', infoContainer);       
                    infoLocation.innerHTML = ('<span>' + currentRow.address + '</span>');  
                }



/*
    to do:
        make rooms change colors based on age
        add colors to rooms
*/

//add to class="timetableSelect__list"
//    add subtitle with insertAdjacentHtml()
//    add buttons under subtitle, sort somehow

    }
}

//function that creates a div and appends it to appendTo
function createDiv(htmlClass, appendTo = null)
{
    let div = document.createElement("div")
    div.classList.add(htmlClass);
    if (appendTo != null)
    {
        appendTo.append(div);
    }
    return div;


}
























//generate shell div with class="timetable__block timetableBlock timetableBlock_preschoolers open js-timetable-block" data-group="preschoolers" data-class="3-4-age"
//put object into position

//generate button
