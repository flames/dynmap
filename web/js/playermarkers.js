componentconstructors['playermarkers'] = function(dynmap, configuration) {
	var me = this;
	$(dynmap).bind('playeradded', function(event, player) {
		// Create the player-marker.
		var markerPosition = dynmap.getProjection().fromLocationToLatLng(player.location);
		player.marker = new L.CustomMarker(markerPosition, { elementCreator: function() {
			var div = document.createElement('div');
			var playerImage;
			
			$(player.marker._element).toggle(dynmap.world === player.location.world);
			
			$(div)
				.addClass('Marker')
				.addClass('playerMarker')
				.append(playerImage = $('<img/>')
						.attr({ src: config.rootpath + 'images/player.png' }))
				.append($('<span/>')
					.addClass(configuration.smallplayerfaces?'playerNameSm':'playerName')
					.text(player.name));
			
			if (configuration.showplayerfaces) {
				if(configuration.smallplayerfaces) {
					getMinecraftHead(player.account, 16, function(head) {
						$(head)
							.addClass('playericon')
						.prependTo(div);
						playerImage.remove();
					});
				}
				else {
					getMinecraftHead(player.account, 32, function(head) {
						$(head)
							.addClass('playericon')
						.prependTo(div);
						playerImage.remove();
					});
				}
			}
			if (configuration.showplayerhealth) {
                if(!configuration.showplayerfaces) /* Need 32 high */
                    playerImage.css('margin-bottom','16px');
                    
				player.healthContainer = $('<div/>')
					.addClass('healthContainer')
					.appendTo(div);
				if (player.health !== undefined && player.armor !== undefined) {
					player.healthBar = $('<div/>')
						.addClass('playerHealth')
						.css('width', (player.health/2*5) + 'px');
					player.armorBar = $('<div/>')
						.addClass('playerArmor')
						.css('width', (player.armor/2*5) + 'px');

					$('<div/>')
						.addClass('playerHealthBackground')
						.append(player.healthBar)
						.appendTo(player.healthContainer);
					$('<div/>')
						.addClass('playerArmorBackground')
						.append(player.armorBar)
						.appendTo(player.healthContainer);
				} else {
					player.healthContainer.css('display','none');
				}
			}
			return div;
		}});
		dynmap.map.addLayer(player.marker);
	});
	$(dynmap).bind('playerremoved', function(event, player) {
		// Remove the marker.
		dynmap.map.removeLayer(player.marker);
	});
	$(dynmap).bind('playerupdated', function(event, player) {
		// Update the marker.
		var markerPosition = dynmap.getProjection().fromLocationToLatLng(player.location);
		$(player.marker._element).toggle(dynmap.world === player.location.world);
		player.marker.setLatLng(markerPosition);
		// Update health
		if (configuration.showplayerhealth) {
			if (player.health !== undefined && player.armor !== undefined) {
				player.healthContainer.css('display','block');
				player.healthBar.css('width', (player.health/2*5) + 'px');
				player.armorBar.css('width', (player.armor/2*5) + 'px');
			} else {
				player.healthContainer.css('display','none');
			}
		}
	});
    // Remove marker on start of map change
	$(dynmap).bind('mapchanging', function(event) {
		var name;
		for(name in dynmap.players) {
			var player = dynmap.players[name];
			// Turn off marker - let update turn it back on 
			$(player.marker._element).toggle(false);
		}
	});
    // Remove marker on map change - let update place it again
	$(dynmap).bind('mapchanged', function(event) {
		var name;
		for(name in dynmap.players) {
			var player = dynmap.players[name];
			var markerPosition = dynmap.getProjection().fromLocationToLatLng(player.location);
			player.marker.setLatLng(markerPosition);
			$(player.marker._element).toggle(dynmap.world === player.location.world);
		}
	});
};
