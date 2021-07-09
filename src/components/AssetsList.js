import React, { useState, useEffect } from 'react'
import Asset from './Asset'
import axios from "axios";

export default function AssetsList() {
    const [assetsList, setassetsList] = useState([])
    const [recordForEdit, setRecordForEdit] = useState(null)

    useEffect(() => {
        refreshAssetList();
    }, [])
    const assetsAPI = (url = 'https://localhost:5001/api/Asset/') => {
        return {
            fetchAll: () => axios.get(url),
            create: newRecord => axios.post(url, newRecord),
            update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
            delete: id => axios.delete(url + id)
        }
    }

    function refreshAssetList() {
        assetsAPI().fetchAll()
            .then(res => {
                setassetsList(res.data)
            })
            .catch(err => console.log(err))
    }

    const addOrEdit = (formData, onSuccess) => {
        if (formData.get('assetID') == "0")
            assetsAPI().create(formData)
                .then(res => {
                    onSuccess();
                    refreshAssetList();
                })
                .catch(err => console.log(err))
        else
            assetsAPI().update(formData.get('assetID'), formData)
                .then(res => {
                    onSuccess();
                    refreshAssetList();
                })
                .catch(err => console.log(err))

    }

    const showRecordDetails = data => {
        setRecordForEdit(data)
    }

    const onDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure to delete this record?'))
            assetsAPI().delete(id)
                .then(res => refreshAssetList())
                .catch(err => console.log(err))
    }

    const imageCard = data => (
        <div className="card" onClick={() => { showRecordDetails(data) }}>
            <img src={data.imageSrc} className="card-img-top rounded-circle" />
            <div className="card-body">
                <h5>{data.assetName}</h5>
                <span>{data.occupation}</span> <br />
                <button className="btn btn-light delete-button" onClick={e => onDelete(e, parseInt(data.assetID))}>
                    <i className="far fa-trash-alt"></i>
                </button>
            </div>
        </div>
    )


    return (
        <div className="row">
            <div className="col-md-12">
                <div className="jumbotron jumbotron-fluid py-4">
                    <div className="container text-center">
                        <h1 className="display-4">Asset Register</h1>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <Asset
                    addOrEdit={addOrEdit}
                    recordForEdit={recordForEdit}
                />
            </div>
            <div className="col-md-8">
                <table>
                    <tbody>
                        {
                            //tr > 3 td
                            [...Array(Math.ceil(assetsList.length / 3))].map((e, i) =>
                                <tr key={i}>
                                    <td>{imageCard(assetsList[3 * i])}</td>
                                    <td>{assetsList[3 * i + 1] ? imageCard(assetsList[3 * i + 1]) : null}</td>
                                    <td>{assetsList[3 * i + 2] ? imageCard(assetsList[3 * i + 2]) : null}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
