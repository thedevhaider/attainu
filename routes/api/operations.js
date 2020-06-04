const fs = require('fs');
const sharp = require('sharp');
const axios = require('axios');
const express = require("express");
const jsonpatch = require("jsonpatch")
const validatePatchInput = require("../../validation/patch")
const validateThumbnailInput = require("../../validation/thumbnail")
const passport = require("passport");
const router = express.Router();

// @routes     GET api/operations/healthcheck
// @desc       Tests operations routes
// @access     Public
router.get("/healthcheck", (req, res) => res.json({ operations: "Operations Working" }));

// @routes     PATCH api/operations/patch
// @desc       Patch document
// @access     Private
router.patch(
    "/patch",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        //Validate Register Inputs
        const { errors, isValid } = validatePatchInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }

        //Apply Json Patch to document
        try {
            patched_document = jsonpatch.apply_patch(req.body.document, req.body.patch);
            res.json(patched_document);
        } catch (error) {
            res.status(400).json(error);
        }
    }
);

// @routes     GET api/operations/thumbnail
// @desc       Convert Image to Thumbnail
// @access     Private
router.get(
    "/thumbnail",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        //Validate Register Inputs
        const { errors, isValid } = validateThumbnailInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }

        // Make a request to image url to download
        url = req.body.url
        axios({
            url,
            responseType: 'stream',
          }).then(
            response =>
              new Promise((resolve, reject) => {
                inputFile = `${Date.now()}.jpg`
                outputFile = `output_${inputFile}`

                // Download the image and save
                response.data
                  .pipe(fs.createWriteStream(inputFile))
                  .on('finish', () => {
                    // Resize the image
                    sharp(inputFile).resize({ height: 50, width: 50 }).toFile(outputFile)
                    .then(function(info) {
                        console.log("Resized image");
                        // Delete the input image
                        fs.unlink(inputFile, () => console.log(`${inputFile} deleted`))
                        // Send file to client and delete it after sending
                        res.download(outputFile, () => fs.unlink(outputFile, () => console.log(`${outputFile} deleted`)))
                    })
                    .catch(function(err) {
                        console.log("Error occured");
                        // Delete image file if something wrong happened
                        fs.unlink(inputFile, () => console.log(`${inputFile} deleted`))
                        fs.unlink(outputFile, () => console.log(`${outputFile} deleted`))
                        res.status(400).json(err)
                    });
                  })
                  .on('error', e => res.status(400).json(err));
              }),
          ).catch(err => {
            console.log(err)
            res.status(400).json(err)
          });
    }
);

module.exports = router;