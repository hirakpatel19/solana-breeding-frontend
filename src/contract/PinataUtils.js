import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const pinata_api_key = "ea17524fbb6393721fc1";
const secret = "a02c92f04c99aef3ad055674026dafac45f6d861de55317409a6d27339a2592c";
export const uploadFileToIPFS = async (filePath, metaJson) => {
    var data = new FormData();
    data.append('file', fs.createReadStream(filePath));
    data.append('pinataOptions', '{"cidVersion": 1}');
    data.append('pinataMetadata', '{"name": "MyFile", "keyvalues": {"company": "Pinata"}}');

    var config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        headers: {
            pinata_api_key: pinata_api_key,
            pinata_secret_api_key: secret
        },
        data: data
    };

    const res = await axios(config);

    if (res.data.IpfsHash) {
        let ipfsImgPath = "https://ipfs.infura.io/ipfs/" + res.data.IpfsHash;
        metaJson.image = ipfsImgPath;
        metaJson.properties.files[0].uri = ipfsImgPath;

        const resMeta = await axios.post(`https://api.pinata.cloud/pinning/pinJSONToIPFS`, metaJson, {
            headers: {
                pinata_api_key: pinata_api_key,
                pinata_secret_api_key: secret
            }
        });

        if (resMeta.data.IpfsHash) {
            return "https://ipfs.infura.io/ipfs/" + resMeta.data.IpfsHash;
        }
    }

    return null;
}
