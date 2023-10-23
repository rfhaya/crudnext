import { Button, Form, Input, Space } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";

import TextArea from "antd/es/input/TextArea";

const CustomModal = ({ onCloseModal, initialData }: any) => {

    const [form] = Form.useForm();
    const [disabledSave, setDisabledSave] = useState(true);

    const [nama, setNama] = useState("");
    const [deskripsi, setDeskripsi] = useState("");

    const handleCancel = () => {
        onCloseModal(null);
    };

    useEffect(() => {
        setNama(initialData?.nama);
        setDeskripsi(initialData?.deskripsi);
        setDisabledSave(true);
        form.resetFields()
        form.setFieldsValue(initialData);
    }, [initialData, form]);

    const handleSave = (e:any) => {
        e.preventDefault();
        onCloseModal({
            nama,
            deskripsi,
            id: initialData?.id,
        }, form.resetFields());
        setDisabledSave(true)
    };

    const handleFormChange = () => {
        const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);
        setDisabledSave(hasErrors);
    }
      
    return (
        <>
        <Form 
                form={form}
                layout="vertical" 
                autoComplete="off"
                onFieldsChange={handleFormChange}
            >
                <Form.Item
                            name = "nama" 
                            label = "Nama Produk"
                            rules = {[{ required: true }, 
                                    { type: 'string', warningOnly: true }
                                    ]}
                >
                    <Input placeholder="input" value={nama} onChange={(e) => {setNama(e.target.value)}}/>
                </Form.Item>

                <Form.Item 
                            name = "deskripsi" 
                            label = "Deskripsi"
                >
                    <TextArea rows={4} value={deskripsi} onChange={(e) => {setDeskripsi(e.target.value)}}/>
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button htmlType="button" onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit" onClick={handleSave} className="bg-black"
                        disabled = {disabledSave}
                        >Submit</Button>
                    </Space>
                </Form.Item>
            </Form>
        </>
    );
}

export default CustomModal;