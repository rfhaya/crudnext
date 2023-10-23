'use client'

import { MenuFoldOutlined, MenuUnfoldOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Layout, Menu, Modal, Popconfirm, Row, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProdukStore } from './store/produkStore';
import CustomModal from './component/customModal';
const { Header, Sider, Content } = Layout;

export default function Home() {
    const [collapsed, setCollapsed] = useState(false);
    const [form] = Form.useForm();
    
    const [modalOpen, setModalOpen] = useState(false);
    const [searchText, setSearchText] = useState("");

    const [modalData, setModalData] = useState(null);

    const [itemIdToDelete, setItemIdToDelete] = useState(0);

    const allproduk = useProdukStore((state:any) => state.produkData);

    const createAPICall = useProdukStore((state: any) => state.createProdukAPI);
    
    const callGetAPI = useProdukStore((state:any) => state.getApi);
    
    const callDeleteAPI = useProdukStore((state:any) => state.deleteProdukAPI);

    const updateAPICall = useProdukStore((state:any) => state.updateProdukAPI);

    useEffect(() => {
        if (allproduk.length == 0) {
            callGetAPI();
        };
    }, []);

    const handleModalClose = async (response: { id: any; nama: any; deskripsi: any; }) => {
        setModalOpen(false);
        
        if (response) {      
            if (response.id) {
                form.validateFields(await updateAPICall(
                    {nama: response.nama, deskripsi: response.deskripsi, id: response.id},
                    message.success('Data Berhasil Diedit!')
                ));
            
            } else {
                form.validateFields(await createAPICall(
                    {nama: response.nama, deskripsi: response.deskripsi}, 
                    message.success('Data Berhasil Ditambah!')
                ));
            }
        }
        modalData && setModalData(null);
    }

    const onCancelX = () => {
        setModalOpen(false);
    };

    const cancel = (e: any) => {
        console.log(e);
        message.error('Data Batal Untuk Di Hapus!');
    };

    const DeleteHandler = (id:any) => {
        setItemIdToDelete(id);
    };

    const onConfirm = async () => {
        await callDeleteAPI(itemIdToDelete);
        setItemIdToDelete(0);
        message.success('Data Berhasil Di Hapus!');
    };

    const editItem = (record:any) => {
        setModalData(record);
        setModalOpen(true);
    };

    return (
        <Layout className="h-screen">
            <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="height-8 m-4 bg-rgbawhite" />
            <div className='px-4 text-center items-center self-center'><p className='text-2xl text-white'>Logo</p></div>
            <Menu className='pt-6' theme="dark" mode="inline" defaultSelectedKeys={['1']} items={
                [{
                key: '1',
                icon: <ShoppingCartOutlined />,
                label: 'Produk',
                }
                ]}
            />
            </Sider>
        
            <Layout>
            <Header className="bg-white p-0">
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'px-6 py-0 text-lg leading-10 cursor-pointer hover:#1890ff',
                onClick: () => setCollapsed(!collapsed),
                })}
            </Header>

            <Content className="mx-6 my-4 p-6 text-center">
                <div className='mb-4'>
                    <Row gutter={{ md: 24}} justify="center">                            
                        <Col span={21}>
                            <Input.Search type="text" placeholder='Search Here...' onSearch={(value:any) => {setSearchText(value)}} onChange={(e) => {setSearchText(e.target.value)}} />
                        </Col>

                        <Col>
                            <Button type="primary" className='bg-black' onClick={() => setModalOpen(true)}>Tambah Data</Button>
                            <Modal title = "Tambah Data Produk" maskClosable = {false} open = {modalOpen} onCancel={onCancelX} footer={null}>
                                <CustomModal onCloseModal={handleModalClose} initialData={modalData}></CustomModal>
                            </Modal>
                        </Col>
                    </Row>
                </div>

                <div>
                    <Table dataSource={allproduk} rowKey="id" sortDirections={["descend", "ascend"]} pagination = {{ pageSize: 5, showTotal: (total, range) => `${range[0]} - ${range[1]} Data dari Total ${total} Data`, }} >
                        <Table.Column dataIndex='id' title="No" defaultSortOrder='ascend' sorter={(a:any, b:any) => a.id - b.id} />
                        <Table.Column dataIndex="nama" title="Nama Produk" filteredValue={[searchText]}  onFilter={(value:any, record:any) => {return String(record.nama).toLowerCase().includes(value)}}/>
                        <Table.Column dataIndex="deskripsi" title="Deskripsi" ellipsis={true} />
                        <Table.Column title= "Aksi" dataIndex= "aksi"
                        render={(_, record: any) => {
                            return (
                            <Space>
                                <Button onClick={() => editItem(record)} className='border border-indigo-600'>Edit</Button>
                                <Popconfirm
                                            title="Hapus Data"
                                            description="Apakah Anda Yakin Ingin Menghapus Data ini?"
                                            okButtonProps={{className:'bg-red-500'}}
                                            onConfirm={onConfirm}
                                            onCancel={cancel}
                                            okText="Hapus"
                                            cancelText="Tidak">
                                    <Button danger onClick={() => {DeleteHandler(record.id)}}>Delete</Button>
                                </Popconfirm>
                            </Space>
                            );
                        }}
                        />
                    </Table>
                </div>
                </Content>
            </Layout>
      </Layout>
    )
}