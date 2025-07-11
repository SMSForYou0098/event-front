import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form } from 'react-bootstrap'

const SiteSettings = (props) => {
    const { appName, setLogo, setAuthLogo, setFavicon, setAppName, complimentaryValidation, setComplimentaryValidation, missedCallNumber, setMissedCallNumber, setWaNumber, waNumber, notifyReq, setNotifyReq,setMobileLogo,homeDividerData, setHomeDividerData } = props;

    const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (homeDividerData.home_divider && typeof homeDividerData.home_divider === 'string') {
      setPreviewUrl(homeDividerData.home_divider);
    }
  }, [homeDividerData.home_divider]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setHomeDividerData((prev) => ({
      ...prev,
      home_divider: file,
    }));

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setHomeDividerData((prev) => ({
      ...prev,
      home_divider: null,
    }));
    setPreviewUrl('');
  };
    return (
      <>
        <Col lg="4">
          <Form.Group className="mb-3 form-group">
            <Form.Label>Logo</Form.Label>
            <Form.Control
              accept="image/*"
              type="file"
              id="logoFile"
              onChange={(e) => setLogo(e.target.files[0])}
            />
          </Form.Group>
        </Col>
        <Col lg="4">
          <Form.Group className="mb-3 form-group">
            <Form.Label>Auth Logo</Form.Label>
            <Form.Control
              accept="image/*"
              type="file"
              id="logoFile"
              onChange={(e) => setMobileLogo(e.target.files[0])}
            />
          </Form.Group>
        </Col>
        <Col lg="4">
          <Form.Group className="mb-3 form-group">
            <Form.Label>Mobile Logo</Form.Label>
            <Form.Control
              accept="image/*"
              type="file"
              id="logoFile"
              onChange={(e) => setAuthLogo(e.target.files[0])}
            />
          </Form.Group>
        </Col>
        <Col lg="4">
          <Form.Group className="mb-3 form-group">
            <Form.Label>Favicon</Form.Label>
            <Form.Control
              type="file"
              id="faviconFile"
              onChange={(e) => setFavicon(e.target.files[0])}
            />
          </Form.Group>
        </Col>
        <Col lg="4">
          <Form.Group className="mb-3 form-group">
            <Form.Label>App Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="App name"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col lg="4">
          <Form.Group className="mb-3 form-group">
            <Form.Label>WhatsApp Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="WhatsApp Number"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col lg="4">
          <Form.Group className="mb-3 form-group">
            <Form.Label>Missed Call Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="Missed Call Number"
              value={missedCallNumber}
              onChange={(e) => setMissedCallNumber(e.target.value)}
            />
          </Form.Group>
        </Col>
        {/* make col for switch */}
        <Col lg="3" className="d-flex align-items-center">
          <Form.Group className="mb-0 form-group">
            <Form.Label>{"User Notification Permission"}</Form.Label>
            <Form.Check type="switch">
              <Form.Check.Input
                checked={notifyReq}
                onChange={(e) => setNotifyReq(e.target.checked)}
              />
              <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
            </Form.Check>
          </Form.Group>
        </Col>
        <Col lg="3" className="d-flex align-items-center">
          <Form.Group className="mb-0 form-group">
            <Form.Label>{"Complimentary User Validation"}</Form.Label>
            <Form.Check type="switch">
              <Form.Check.Input
                checked={complimentaryValidation}
                onChange={(e) => setComplimentaryValidation(e.target.checked)}
              />
              <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
            </Form.Check>
          </Form.Group>
        </Col>
        <Col lg="4" className="mb-3">
          <Form.Group>
            <Form.Label>Home Divider Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>

          {previewUrl && (
            <Card className="mt-2 position-relative">
              <Button
                variant="danger"
                size="sm"
                onClick={handleRemoveImage}
                className="position-absolute top-0 end-0 m-1 rounded-circle p-1"
                style={{ zIndex: 1 }}
              >
                <X size={16} />
              </Button>
              <Card.Img
                src={previewUrl}
                style={{ height: "150px", objectFit: "contain" }}
                alt="Preview"
              />
            </Card>
          )}
        </Col>

        <Col lg="4" className="mb-3">
          <Form.Group>
            <Form.Label>Home Divider External URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter external image URL"
              value={homeDividerData.home_divider_url}
              onChange={(e) =>
                setHomeDividerData((prev) => ({
                  ...prev,
                  home_divider_url: e.target.value,
                }))
              }
            />
          </Form.Group>
        </Col>
      </>
    );
}

export default SiteSettings
