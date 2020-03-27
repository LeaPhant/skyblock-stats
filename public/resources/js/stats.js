document.addEventListener('DOMContentLoaded', function(){
    tippy('*[data-tippy-content]');

    const all_items = items.armor.concat(items.inventory, items.enderchest, items.talisman_bag, items.fishing_bag, items.quiver, items.potion_bag);

    let dimmer = document.querySelector("#dimmer");

    let inventoryContainer = document.querySelector('#inventory_container');

    if(calculated.profile.cute_name == 'Deleted')
        history.replaceState({}, document.title, '/stats/' + calculated.display_name + '/' + calculated.profile.profile_id);
    else
        history.replaceState({}, document.title, '/stats/' + calculated.display_name + '/' + calculated.profile.cute_name);

    function isEnchanted(item){
        if(item.animated)
            return false;

        if(item.id == 399)
            return true;

        if('texture_path' in item && item.texture_path.endsWith('.gif')) // disable enchanted overlay for gifs cause laggy
            return false;

        if('id' in item && [403, 384].includes(item.id))
            return true;

        if('tag' in item && Array.isArray(item.tag.ench))
            return true;

        return false;
    };

    let currentBackpack;

    function renderInventory(inventory, type){
        let scrollTop = window.pageYOffset;

        let visibleInventory = document.querySelector('.inventory-view.current-inventory');

        if(visibleInventory){
            visibleInventory.classList.remove('current-inventory');
            document.querySelector('#inventory_container').removeChild(visibleInventory);
        }

        let inventoryView = document.createElement('div');
        inventoryView.className = 'inventory-view current-inventory processed';
        inventoryView.setAttribute('data-inventory-type', type);

        if(type == 'inventory')
            inventory = inventory.slice(9, 36).concat(inventory.slice(0, 9));

        inventory.forEach((item, index) => {
            let inventorySlot = document.createElement('div');
            inventorySlot.className = 'inventory-slot';

            if(item.id){
                let inventoryItemIcon = document.createElement('div');
                let inventoryItemCount = document.createElement('div');

                inventoryItemIcon.className = 'piece-icon item-icon icon-' + item.id + '_' + item.Damage;

                if(item.texture_path){
                    inventoryItemIcon.className += ' custom-icon';
                    inventoryItemIcon.style.backgroundImage = 'url("' +  item.texture_path + '")';
                }

                if(isEnchanted(item))
                    inventoryItemIcon.classList.add('is-enchanted');

                inventoryItemCount.className = 'item-count';
                inventoryItemCount.innerHTML = item.Count;

                let inventoryItem = document.createElement('div');

                bindLoreEvents(inventoryItem);

                inventoryItem.className = 'rich-item inventory-item';

                if(type == 'backpack')
                    inventoryItem.setAttribute('data-backpack-item-index', index);
                else
                    inventoryItem.setAttribute('data-item-index', item.item_index);

                inventoryItem.appendChild(inventoryItemIcon);

                if(item.Count != 1)
                    inventoryItem.appendChild(inventoryItemCount);

                inventorySlot.appendChild(inventoryItem);
            }

            inventoryView.appendChild(inventorySlot);

            inventoryView.appendChild(document.createTextNode(" "));

            if((index + 1) % 9 == 0)
                inventoryView.appendChild(document.createElement("br"));

            if((index + 1) % 27 == 0 && type == 'inventory')
                inventoryView.appendChild(document.createElement("br"));
        });

        inventoryContainer.appendChild(inventoryView);

        [].forEach.call(inventoryView.querySelectorAll('.item-icon.is-enchanted'), handleEnchanted);

        window.scrollTo({
            top: scrollTop
        });

        let inventoryStatContainer = document.querySelector('.stat-inventory');

        let rect = inventoryStatContainer.getBoundingClientRect();

        if(rect.top < 0 || rect.bottom > window.innerHeight)
            inventoryStatContainer.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function showBackpack(item){
        let activeInventory = document.querySelector('.inventory-tab.active-inventory');

        if(activeInventory)
            activeInventory.classList.remove('active-inventory');

        renderInventory(item.containsItems, 'backpack');

        currentBackpack = item;
    }

    function fillLore(element){
        let item = [];

        if(element.hasAttribute('data-backpack-index')){
            let backpack = all_items.filter(a => a.item_index == Number(element.getAttribute('data-backpack-index')));

            if(backpack.length == 0)
                return;

            backpack = backpack[0];

            item = backpack.containsItems.filter(a => a.item_index == Number(element.getAttribute('data-item-index')));
        }else if(element.hasAttribute('data-item-index'))
            item = all_items.filter(a => a.item_index == Number(element.getAttribute('data-item-index')));
        else if(element.hasAttribute('data-backpack-item-index'))
            item = [currentBackpack.containsItems[Number(element.getAttribute('data-backpack-item-index'))]];
        else if(element.hasAttribute('data-pet-index'))
            item = [calculated.pets[parseInt(element.getAttribute('data-pet-index'))]];

        if(item.length == 0)
            return;

        item = item[0];

        if(element.hasAttribute('data-item-index'))
            statsContent.setAttribute("data-item-index", item.item_index);
        else if(element.hasAttribute('data-backpack-item-index'))
            statsContent.setAttribute("data-backpack-item-index", element.getAttribute('data-backpack-item-index'));
        else if(element.hasAttribute('data-pet-index'))
            statsContent.setAttribute("data-backpack-item-index", element.getAttribute('data-pet-index'));

        itemName.className = 'item-name ' + 'piece-' + (item.rarity || 'common') + '-bg';
        itemNameContent.innerHTML = item.display_name || 'null';

        if(element.hasAttribute('data-pet-index'))
            itemNameContent.innerHTML = `[Lvl ${item.level.level}] ${item.display_name}`;

        if(item.texture_path){
            itemIcon.style.backgroundImage = 'url("' + item.texture_path + '")';
            itemIcon.className = 'stats-piece-icon item-icon custom-icon';
        }else{
            itemIcon.removeAttribute('style');
            itemIcon.classList.remove('custom-icon');
            itemIcon.className = 'stats-piece-icon item-icon icon-' + item.id + '_' + item.Damage;
        }

        if(isEnchanted(item))
            handleEnchanted(itemIcon);

        itemLore.innerHTML = item.lore || '';

        if(item.texture_pack){
            const texturePack = extra.packs.filter(a => a.id == item.texture_pack)[0];

            let packContent = document.createElement('div');
            packContent.classList.add('pack-credit');

            let packIcon = document.createElement('img');
            packIcon.setAttribute('src', texturePack.basePath + '/pack.png');
            packIcon.classList.add('pack-icon');

            let packName = document.createElement('a');
            packName.setAttribute('href', texturePack.url);
            packName.setAttribute('target', '_blank');
            packName.classList.add('pack-name');
            packName.innerHTML = texturePack.name;

            let packAuthor = document.createElement('div');
            packAuthor.classList.add('pack-author');
            packAuthor.innerHTML = 'by <span>' + texturePack.author + '</span>';

            packContent.appendChild(packIcon);
            packContent.appendChild(packName);
            packContent.appendChild(packAuthor);

            itemLore.appendChild(document.createElement('br'));

            itemLore.appendChild(packContent);
        }

        backpackContents.innerHTML = '';

        if(Array.isArray(item.containsItems)){
            backpackContents.classList.add('contains-backpack');

            item.containsItems.forEach((backpackItem, index) => {
                let inventorySlot = document.createElement('div');
                inventorySlot.className = 'inventory-slot backpack-slot';

                if(backpackItem.id){
                    let inventoryItemIcon = document.createElement('div');
                    let inventoryItemCount = document.createElement('div');

                    let enchantedClass = isEnchanted(backpackItem) ? 'is-enchanted' : '';

                    inventoryItemIcon.className = 'piece-icon item-icon ' + enchantedClass + ' icon-' + backpackItem.id + '_' + backpackItem.Damage;

                    if(backpackItem.texture_path){
                        inventoryItemIcon.className += ' custom-icon';
                        inventoryItemIcon.style.backgroundImage = 'url("' + backpackItem.texture_path + '")';
                    }

                    inventoryItemCount.className = 'item-count';
                    inventoryItemCount.innerHTML = backpackItem.Count;

                    let inventoryItem = document.createElement('div');

                    inventoryItem.className = 'inventory-item';

                    inventoryItem.appendChild(inventoryItemIcon);

                    if(backpackItem.Count > 1)
                        inventoryItem.appendChild(inventoryItemCount);

                    inventorySlot.appendChild(inventoryItem);
                }

                backpackContents.appendChild(inventorySlot);

                backpackContents.appendChild(document.createTextNode(" "));

                if((index + 1) % 9 == 0)
                    backpackContents.appendChild(document.createElement("br"));
            });

            [].forEach.call(document.querySelectorAll('.contains-backpack .item-icon.is-enchanted'), handleEnchanted);

            let viewBackpack = document.createElement('div');
            viewBackpack.classList = 'view-backpack';

            let viewBackpackText = document.createElement('div');
            viewBackpackText.innerHTML = '<span>View Backpack</span><br><span>(Hold CTRL while clicking backpack to immediately open)</span>';

            viewBackpack.appendChild(viewBackpackText);

            viewBackpack.addEventListener('click', function(){
                showBackpack(item);
                closeLore();
            });

            backpackContents.appendChild(viewBackpack);
        }else{
            backpackContents.classList.remove('contains-backpack');
        }
    }

    function showLore(element, _resize){
        statsContent.classList.add('sticky-stats');
        element.classList.add('sticky-stats');
        dimmer.classList.add('show-dimmer');

        if(_resize != false)
            resize();
    }

    function closeLore(){
        let shownLore = document.querySelector('#stats_content.show-stats, #stats_content.sticky-stats');

        if(shownLore != null){
            dimmer.classList.remove('show-dimmer');

            let stickyStatsPiece = document.querySelector('.rich-item.sticky-stats');

            if(stickyStatsPiece != null){
                stickyStatsPiece.blur();
                stickyStatsPiece.classList.remove('sticky-stats');
            }

            statsContent.classList.remove('sticky-stats', 'show-stats');
        }
    }

    function resize(){
        tippy('*[data-tippy-content]');

        navBarSticky = new Sticky('#nav_bar');
        updateStatsPositions();

        let element = document.querySelector('.rich-item.sticky-stats');

        if(element == null)
            return;

        let maxTop = window.innerHeight - statsContent.offsetHeight - 20;
        let rect = element.getBoundingClientRect();

        if(rect.x)
            statsContent.style.left = rect.x - statsContent.offsetWidth - 10 + "px";

        if(rect.y)
            statsContent.style.top = Math.max(70, Math.min(maxTop, (rect.y + element.offsetHeight / 2) - statsContent.offsetHeight / 2)) + 'px';
    }

    [].forEach.call(document.querySelectorAll('.stat-weapons .select-weapon'), function(element){
        let item_index = element.parentNode.getAttribute('data-item-index');
        let item = items.weapons.filter(a => a.item_index == item_index)[0];

        let weaponStats = calculated.weapon_stats[item_index];
        let stats;

        element.addEventListener('mousedown', function(e){
            e.preventDefault();
        });

        element.addEventListener('click', function(e){
            if(element.parentNode.classList.contains('piece-selected')){
                element.parentNode.classList.remove("piece-selected");

                stats = calculated.stats;

                document.querySelector('.stat-active-weapon').className = 'stat-value stat-active-weapon piece-common-fg';
                document.querySelector('.stat-active-weapon').innerHTML = 'None';
            }else{
                [].forEach.call(document.querySelectorAll('.stat-weapons .piece'), function(_element){
                    _element.classList.remove("piece-selected");
                });

                element.parentNode.classList.add("piece-selected");

                document.querySelector('.stat-active-weapon').className = 'stat-value stat-active-weapon piece-' + item.rarity + '-fg';
                document.querySelector('.stat-active-weapon').innerHTML = item.display_name;

                stats = weaponStats;
            }

            anime({
                targets: '.stat-active-weapon',
                backgroundColor: ['rgba(255,255,255,1)', 'rgba(255,255,255,0)'],
                duration: 500,
                round: 1,
                easing: 'easeOutCubic'
            });

            for(let stat in stats){
                let element = document.querySelector('.basic-stat[data-stat=' + stat + '] .stat-value');

                if(!element)
                    continue;

                let currentValue = Number(element.innerHTML);
                let newValue = stats[stat];

                if(newValue != currentValue){
                    anime({
                        targets: '.basic-stat[data-stat=' + stat + '] .stat-value',
                        innerHTML: newValue,
                        backgroundColor: ['rgba(255,255,255,1)', 'rgba(255,255,255,0)'],
                        duration: 500,
                        round: 1,
                        easing: 'easeOutCubic'
                    });
                }
            }
        });
    });

    function getPart(src, x, y, width, height){
        let dst = document.createElement('canvas');
        dst.width = width;
        dst.height = height;

        let ctx = dst.getContext("2d");

        // don't blur on resize
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(src, x, y, width, height, 0, 0, (width - src.width) / 2 + width, (height - src.height) / 2 + height);
        return dst;
    }

    function handleEnchanted(element){
        let size = 128;

        let canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        canvas.className = 'enchanted-overlay';

        let ctx = canvas.getContext('2d');

        let src = window.getComputedStyle(element).backgroundImage.split('("').pop().split('")')[0];
        let image = new Image(128, src.includes('/head/') ? 118 : 128);

        if(src.endsWith('.gif'))
            return false;

        image.onload = function(){
            if(!element.classList.contains('custom-icon')){
                let position = window.getComputedStyle(element).backgroundPosition.split(" ");
                let x = Math.abs(parseInt(position[0]));
                let y = Math.abs(parseInt(position[1]));
                image = getPart(image, x, y, size, size);
            }

            ctx.globalAlpha = 1;

            ctx.drawImage(image, 0, 128 / 2 - image.height / 2);

            ctx.globalAlpha = 0.5;
            ctx.globalCompositeOperation = 'source-atop';

            ctx.drawImage(enchantedGlint, 0, 0, canvas.width, canvas.height);

            element.style.backgroundImage = 'url(' + canvas.toDataURL('image/png') + ')';
            element.classList.add('custom-icon');
        };

        image.src = src;
    }

    let enchantedGlint = new Image(128, 128);

    enchantedGlint.onload = function(){
        [].forEach.call(document.querySelectorAll('.item-icon.is-enchanted'), handleEnchanted);
    }

    enchantedGlint.src = '/resources/img/glint.png';

    [].forEach.call(document.querySelectorAll('.inventory-tab'), function(element){
        let type = element.getAttribute('data-inventory-type');

        element.addEventListener('click', function(){
            if(element.classList.contains('active-inventory'))
                return;

            let activeInventory = document.querySelector('.inventory-tab.active-inventory');

            if(activeInventory)
                activeInventory.classList.remove('active-inventory');

            element.classList.add('active-inventory');

            renderInventory(items[type], type);
        });
    });

    const statsContent = document.querySelector('#stats_content');
    const itemName = statsContent.querySelector('.item-name');
    const itemIcon = itemName.querySelector('div:first-child');
    const itemNameContent = itemName.querySelector('span');
    const itemLore = statsContent.querySelector('.item-lore');
    const backpackContents = statsContent.querySelector('.backpack-contents');

    function bindLoreEvents(element){
        element.addEventListener('mouseenter', function(e){
            if(e.target.classList.contains('select-weapon'))
                return;

            fillLore(element, false);
            statsContent.classList.add('show-stats');
        });

        element.addEventListener('mouseleave', function(e){
            if(e.target.classList.contains('select-weapon'))
                return;

            statsContent.classList.remove('show-stats');
        });

        element.addEventListener('mousemove', function(e){
            if(statsContent.classList.contains('sticky-stats'))
                return;

            let maxTop = window.innerHeight - statsContent.offsetHeight - 20;
            let rect = element.getBoundingClientRect();

            let left = rect.x - statsContent.offsetWidth - 10;

            if(left < 10)
                left = rect.x + 90;

            if(rect.x)
                statsContent.style.left = left + 'px';

            let top = Math.max(70, Math.min(maxTop, e.clientY - statsContent.offsetHeight / 2));

            statsContent.style.top = top + "px";
        });

        element.addEventListener('click', function(e){
            if(!e.target.classList.contains('select-weapon')){
                let itemIndex = Number(element.getAttribute('data-item-index'));
                let item = all_items.filter(a => a.item_index == itemIndex);

                if(item.length > 0)
                    item = item[0];

                if(e.ctrlKey && item && Array.isArray(item.containsItems)){
                    showBackpack(item);
                    closeLore();
                }else{
                    if(statsContent.classList.contains('sticky-stats')){
                        dimmer.classList.remove('show-dimmer');
                        element.blur();
                        element.classList.remove('sticky-stats');
                        statsContent.classList.remove('sticky-stats')
                    }else{
                        showLore(element, false);
                        fillLore(element);
                    }
                }
            }
        });
    }

    [].forEach.call(document.querySelectorAll('.rich-item'), bindLoreEvents);

    let enableApiPlayer = document.querySelector('#enable_api');

    [].forEach.call(document.querySelectorAll('.enable-api'), function(element){
        element.addEventListener('click', function(e){
            e.preventDefault();
            dimmer.classList.add('show-dimmer');
            enableApiPlayer.classList.add('show');

            enableApiPlayer.currentTime = 0;
            enableApiPlayer.play();
        });
    });

    enableApiPlayer.addEventListener('click', function(){
        if(enableApiPlayer.paused)
            enableApiPlayer.play();
        else
            enableApiPlayer.pause();
    });

    dimmer.addEventListener('click', function(e){
        dimmer.classList.remove('show-dimmer');
        enableApiPlayer.classList.remove('show');

        closeLore();
    });

    [].forEach.call(document.querySelectorAll('.close-lore'), function(element){
        element.addEventListener('click', closeLore);
    });

    let searchUser = document.querySelector('#inp_search_user');

    searchUser.addEventListener('keyup', function(e){
        let playerName = searchUser.value;

        if(playerName.trim().length == 0)
            return;

        if(e.keyCode == 13)
            document.location = '/stats/' + playerName;
        else
            document.querySelector('#btn_search_user').href = '/stats/' + playerName;
    });

    let statContainers = document.querySelectorAll('.stat-container[data-stat]');
    let wrapperHeight = document.querySelector('#wrapper').offsetHeight;

    let positionY = {};

    let navBarSticky = new Sticky('#nav_bar');

    function updateStatsPositions(){
        [].forEach.call(statContainers, function(statContainer){
            positionY[statContainer.getAttribute('data-stat')] = statContainer.offsetTop;
        });

        navBarSticky = new Sticky('#nav_bar');
    }

    updateStatsPositions();

    let updateTab = false;
    let updateTabLock = false;

    function updateActiveTab(){
        if(!updateTab)
            return false;

        let rectYs = [];
        let activeIndex = 0;
        let activeY = -Infinity;
        let activeStatContainer;

        if((window.innerHeight + window.scrollY) >= wrapperHeight){
            activeStatContainer = [].slice.call(statContainers).pop();
        }else{
            [].forEach.call(statContainers, function(statContainer){
                rectYs.push(statContainer.getBoundingClientRect().y);
            });

            rectYs.forEach(function(rectY, index){
                if(rectY < 250 && rectY > activeY){
                    activeY = rectY;
                    activeIndex = index;
                }
            });

            activeStatContainer = statContainers[activeIndex];
        }

        let activeTab = document.querySelector('.nav-item[data-target=' + activeStatContainer.getAttribute('data-stat') + ']');

        if(!activeTab.classList.contains('active')){
            [].forEach.call(document.querySelectorAll('.nav-item.active'), function(statContainer){
                statContainer.classList.remove('active');
            });

            anime({
                targets: '#nav_items_container',
                scrollLeft: activeTab.offsetLeft - window.innerWidth / 2 + activeTab.offsetWidth / 2,
                duration: 350,
                easing: 'easeOutCubic'
            });

            activeTab.classList.add('active');
        }

        updateTab = false;
    }

    setInterval(updateActiveTab, 100);

    document.addEventListener('scroll', function(){
        if(!updateTabLock)
            updateTab = true;
    });

    [].forEach.call(document.querySelectorAll('.nav-item'), function(element){
        element.addEventListener('click', function(){
            updateTabLock = true;
            updateTab = false;

            let newActiveTab = this;

            [].forEach.call(document.querySelectorAll('.nav-item.active'), function(statContainer){
                statContainer.classList.remove('active');
            });

            anime({
                targets: window.document.scrollingElement || window.document.body || window.document.documentElement,
                scrollTop: positionY[newActiveTab.getAttribute('data-target')] - 60,
                duration: 350,
                easing: 'easeOutCubic',
                complete: function(){
                    updateTabLock = false;
                    newActiveTab.classList.add('active');
                }
            });

            anime({
                targets: '#nav_items_container',
                scrollLeft: newActiveTab.offsetLeft - window.innerWidth / 2 + newActiveTab.offsetWidth / 2,
                duration: 350,
                easing: 'easeOutCubic'
            });
        });
    });

    let otherSkills = document.querySelector('#other_skills');
    let showSkills = document.querySelector("#show_skills");

    if(showSkills != null){
        showSkills.addEventListener('click', function(){
            if(otherSkills.classList.contains('show-skills')){
                otherSkills.classList.remove('show-skills');
                showSkills.innerHTML = 'Show Skills';
            }else{
                otherSkills.classList.add('show-skills');
                show_skills.innerHTML = 'Hide Skills';
            }

            updateStatsPositions();
        });
    }

    [].forEach.call(document.querySelectorAll('.xp-skill'), function(element){
        let skillProgressText = element.querySelector('.skill-progress-text');
        let originalText = skillProgressText.innerHTML;

        element.addEventListener('mouseenter', function(){
            skillProgressText.innerHTML = skillProgressText.getAttribute('data-hover-text');
        });

        element.addEventListener('mouseleave', function(){
            skillProgressText.innerHTML = originalText;
        });
    });

    [].forEach.call(document.querySelectorAll('.kills-deaths-container .show-all.enabled'), function(element){
        let parent = element.parentNode;
        let kills = calculated[element.getAttribute('data-type')];

        element.addEventListener('click', function(){
            parent.style.maxHeight = parent.offsetHeight + 'px';
            parent.classList.add('all-shown');
            element.remove();

            kills.slice(10).forEach(function(kill, index){
                let killElement = document.createElement('div');
                let killRank = document.createElement('div');
                let killEntity = document.createElement('div');
                let killAmount = document.createElement('div');
                let statSeparator = document.createElement('div');

                killElement.className = 'kill-stat';
                killRank.className = 'kill-rank';
                killEntity.className = 'kill-entity';
                killAmount.className = 'kill-amount';
                statSeparator.className = 'stat-separator';

                killRank.innerHTML = '#' + (index + 11) + '&nbsp;';
                killEntity.innerHTML = kill.entityName;
                killAmount.innerHTML = kill.amount.toLocaleString();
                statSeparator.innerHTML = ':&nbsp;';

                killElement.appendChild(killRank);
                killElement.appendChild(killEntity);
                killElement.appendChild(statSeparator);
                killElement.appendChild(killAmount);

                parent.appendChild(killElement);
            });
        });
    });

    document.querySelector('.top-deaths .show-all').addEventListener('click', function(){
        let parent = this.parentNode;

        this.remove();
        this.parentNode.classList.add('all-shown');
        this.parentNode.style.maxHeight = this.parentNode.offsetHeight + 'px';

        calculated.deaths.slice(10).forEach(function(kill){

        });
    });

    window.addEventListener('keydown', function(e){
        let selectedPiece = document.querySelector('.rich-item:focus');

        if(selectedPiece !== null && e.keyCode == 13){
            fillLore(selectedPiece);
            showLore(selectedPiece);
        }

        if(e.keyCode == 27){
            dimmer.classList.remove('show-dimmer');
            enableApiPlayer.classList.remove('show');
            if(document.querySelector('#stats_content.sticky-stats') != null){
                closeLore();
            }
        }

        if(document.querySelector('.rich-item.sticky-stats') != null && e.keyCode == 9)
            e.preventDefault();
    });

    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('scroll', function(){

    });

    setTimeout(resize, 1000);
});
