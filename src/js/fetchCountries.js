'use strict';
//default
export function fetchCountries(name){
    const ENDPOINT = `https://restcountries.com/v2/name/${name}`;

    return fetch(
        `${ENDPOINT}?fields=name,capital,flags,population,languages`
    ).then (response => {
        if (!response.ok) {
            throw new Error(response.status);
        }

        return response.json()
    })
}