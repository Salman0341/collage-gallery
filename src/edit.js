import { __ } from '@wordpress/i18n';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { Button, PanelBody, PanelRow, IconButton, RangeControl } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck, InspectorControls, MediaPlaceholder, RichText } from '@wordpress/block-editor';
import { clone, isEmpty } from 'lodash';

import './editor.scss';

const ALLOWED_MEDIA_TYPES = [ 'image' ];

function Edit(props) {
	const { images, column, galleryCaption } = props.attributes;

	const [ galleryImages, setGalleryImages ] = useState([]);

	useEffect(
		() => {
			const imagesWithCustomProps = images.map((image) => {
				return {
					...image,
					isActive: false // toolbar dikhany k lye
				};
			});

			setGalleryImages(imagesWithCustomProps);
		},
		[ images ]
	);

	const activeToolbarHandler = (id) => {
		const newGalleryImages = galleryImages.map((galleryITem) => {
			if (galleryITem.id === id) {
				return {
					...galleryITem,
					isActive: true
				};
			}

			return {
				...galleryITem,
				isActive: false
			};
		});

		setGalleryImages(newGalleryImages);
	};

	const deleteImageHandler = (id) => {
		const deleteImage = galleryImages.filter((i) => i.id !== id);
		setGalleryImages(deleteImage);
	};

	const handleReplace = (id, newImage) => {
		const newImageList = galleryImages.map((image) => {
			if (image.id === id) {
				return newImage;
			}

			return image;
		});

		props.setAttributes({ images: newImageList });
	};

	const moveRight = (id) => {
		const currentIndex = galleryImages.findIndex((image) => image.id === id);
		let newIndex = currentIndex + 1;

		let currentImage = galleryImages[currentIndex];
		let nextImage = galleryImages[newIndex];

		let newGalleryImages = clone(galleryImages);

		if (typeof nextImage !== 'undefined') {
			newGalleryImages[currentIndex] = nextImage;
			newGalleryImages[newIndex] = currentImage;

			setGalleryImages(newGalleryImages);
		}
	};

	const moveLeft = (id) => {
		const currentImageIndex = galleryImages.findIndex((imageIndex) => imageIndex.id === id);
		let newImageIndex = currentImageIndex - 1;

		let currentImageLeft = galleryImages[currentImageIndex];
		let nextImageLeft = galleryImages[newImageIndex];
		let newGalleryImagesLeft = clone(galleryImages);

		if (currentImageIndex !== 0) {
			newGalleryImagesLeft[currentImageIndex] = nextImageLeft;
			newGalleryImagesLeft[newImageIndex] = currentImageLeft;
			setGalleryImages(newGalleryImagesLeft);
		}
	};
    
	return (
		<Fragment>
			<figure className="wp-collage-gallery">
				{isEmpty(images) && <MediaPlaceholder
				    icon="format-gallery"
					onSelect={(newImage) => props.setAttributes({images: newImage})}
					allowedTypes={ALLOWED_MEDIA_TYPES}
					multiple={true}
					labels={{ title: 'Collage Gallery'}}>
				</MediaPlaceholder>}
				<ul className={`blocks-collage-grid column_${column}`}>
					{galleryImages.map((image, idx) => {
						const { url, id, isActive } = image;
						return (
							<Fragment>
								<li key={idx} className="blocks-collage-item">
									<img onClick={() => activeToolbarHandler(id)} src={url} />
									{isActive && (
										<Fragment> 
										<div className="cwp_toolbar_Wrapper">
											<div className="cwp_left_toolbar_wrapper">
												<IconButton
												    disabled={0 === idx ? true : false}
													icon="arrow-left-alt2"
													isPrimary
													onClick={() => moveLeft(id)}
												/>
												<IconButton
													disabled={ idx === (galleryImages.length - 1) }
													icon="arrow-right-alt2"
													isPrimary
													onClick={() => moveRight(id)}
												/>
											</div>

											<div className="cwp_right_toolbar_wrapper">
												<MediaUploadCheck>
													<MediaUpload
														onSelect={(newEditImage) => handleReplace(id, newEditImage)}
														allowedTypes={ALLOWED_MEDIA_TYPES}
														render={({ open }) => (
															<IconButton icon="edit" isPrimary onClick={open} />
														)}
													/>
												</MediaUploadCheck>
												<IconButton
													onClick={() => deleteImageHandler(id)}
													isPrimary
													icon="trash"
												/>
											</div>
										</div>
										<div className="cwp_caption_wrapper">
											<RichText 
											 value={galleryCaption}
											 onChange={(newGalleryCaption) => props.setAttributes({galleryCaption:newGalleryCaption})}
											/>
										</div>
										</Fragment>
									)}
								</li>
							</Fragment>
						);
					})}
				</ul>
			</figure>
			<InspectorControls>
				<PanelBody title="Gallery Setting">
					<PanelRow>
						<span>Add Image</span>
						<br />
						<br />
						<MediaUploadCheck>
							<MediaUpload
								onSelect={(newImages) => props.setAttributes({ images: newImages })}
								allowedTypes={ALLOWED_MEDIA_TYPES}
								render={({ open }) => (
									<Button isPrimary onClick={open}>
										Open Media Library
									</Button>
								)}
								multiple={true}
							/>
						</MediaUploadCheck>
					</PanelRow>

					<RangeControl
						label="Columns"
						value={column}
						onChange={(NewColumns) => props.setAttributes({ column: NewColumns })}
						min={1}
						max={4}
					/>
				</PanelBody>
			</InspectorControls>
		</Fragment>
	);
}

export default Edit;
