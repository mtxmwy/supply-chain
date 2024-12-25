

CREATE TABLE `sys_role` (
                            `role_id` int(11) NOT NULL AUTO_INCREMENT,
                            `role_name` varchar(64) DEFAULT NULL COMMENT '角色名称',
                            `role_code` varchar(64) DEFAULT NULL COMMENT '角色编码',
                            `role_desc` varchar(255) DEFAULT NULL  COMMENT '角色描述',
                            `role_level` int(11) DEFAULT '0'  COMMENT '角色等级，角色高的可继承低的',
                            `ds_type` char(1) DEFAULT '2',
                            `ds_scope` varchar(255) DEFAULT NULL,
                            `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
                            `del_flag` char(1) DEFAULT '0',
                            `tenant_id` int(11) DEFAULT NULL,
                            PRIMARY KEY (`role_id`) USING BTREE,
                            KEY `idx_role_code` (`role_code`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='系统角色表';

CREATE TABLE `sys_role_menu` (
                                 `role_id` int(11) NOT NULL COMMENT '角色ID',
                                 `menu_id` int(11) NOT NULL COMMENT '菜单ID',
                                 `tenant_id` int(11) DEFAULT NULL,
                                 PRIMARY KEY (`role_id`,`menu_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单表';


CREATE TABLE `base_menu` (
                             `id` int(11) NOT NULL AUTO_INCREMENT,
                             `code` varchar(255) DEFAULT NULL COMMENT '路径编码',
                             `title` varchar(255) DEFAULT NULL COMMENT '标题',
                             `parent_id` int(11) NOT NULL COMMENT '父级节点',
                             `href` varchar(255) DEFAULT NULL COMMENT '资源路径',
                             `icon` varchar(255) DEFAULT NULL COMMENT '图标',
                             `type` char(10) DEFAULT NULL,
                             `module_id` int(11) DEFAULT NULL COMMENT '所属模块',
                             `module_name` varchar(32) DEFAULT NULL,
                             `order_num` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
                             `description` varchar(255) DEFAULT NULL COMMENT '描述',
                             `path` varchar(500) NOT NULL COMMENT '菜单上下级关系',
                             `show_flag` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否显示1:显示,2:隐藏',
                             `data_validate` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否验证数据权限0：false,1：true',
                             `include_btn` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否包含按钮0:否,1:是',
                             `del_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0:正常,1:删除',
                             `create_by` bigint(20) DEFAULT NULL,
                             `create_user` varchar(32) DEFAULT NULL,
                             `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                             `update_user` varchar(32) DEFAULT NULL,
                             `last_update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最后修改时间',
                             `tenant_id` int(11) DEFAULT NULL,
                             PRIMARY KEY (`id`),
                             UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `front_role_data_scope` (
                                        `id` bigint(20) NOT NULL AUTO_INCREMENT,
                                        `role_id` bigint(20) NOT NULL COMMENT '角色id',
                                        `organization_id` bigint(20) DEFAULT NULL COMMENT '指定部门所在的公司',
                                        `data_scope_type` tinyint(1) NOT NULL COMMENT '数据范围类型1:所属门店/直属部门,2:所属区/班组,3:指定部门,4:指定区/班组,5:所有数据',
                                        `del_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0:正常,1:删除',
                                        `create_by` bigint(20) DEFAULT NULL,
                                        `create_user` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL,
                                        `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                        `update_by` bigint(20) DEFAULT NULL,
                                        `update_user` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL,
                                        `last_update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最后修改时间',
                                        `tenant_id` int(11) unsigned DEFAULT NULL COMMENT '租户ID',
                                        PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `front_role_group` (
                                   `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
                                   `group_id` int(11) NOT NULL COMMENT '用户组id',
                                   `role_id` int(11) NOT NULL COMMENT '角色id',
                                   `create_time` datetime NOT NULL COMMENT '创建时间',
                                   `last_update_time` datetime NOT NULL COMMENT '最后修改时间',
                                   `tenant_id` int(11) unsigned DEFAULT NULL COMMENT '租户ID',
                                   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `base_organization` (
                                     `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
                                     `name` varchar(64) NOT NULL COMMENT '组织名称',
                                     `code` varchar(16) NOT NULL COMMENT '编码',
                                     `state` tinyint(1) DEFAULT '1' COMMENT '状态0:禁用,1:启用',
                                     `legal_person` varchar(32) DEFAULT '' COMMENT '法人',
                                     `del_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0:正常,1:删除',
                                     `create_by` bigint(20) DEFAULT NULL,
                                     `create_user` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL,
                                     `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                     `update_by` bigint(20) DEFAULT NULL,
                                     `update_user` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL,
                                     `last_update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最后修改时间',
                                     `tenant_id` int(11) unsigned DEFAULT NULL COMMENT '租户ID',
                                     PRIMARY KEY (`id`),
                                     UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `base_department` (
                                   `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
                                   `name` varchar(32) NOT NULL COMMENT '部门名称',
                                   `code` varchar(32) DEFAULT NULL COMMENT '部门编码',
                                   `lead_id` int(11) DEFAULT NULL COMMENT '领班人Id',
                                   `lead_name` varchar(32) DEFAULT NULL COMMENT '领班姓名',
                                   `attribute` int(11) NOT NULL DEFAULT '1' COMMENT '部门属性：1部门，2门店，3生产',
                                   `state` int(11) NOT NULL DEFAULT '1' COMMENT '状态：1正常，2撤销',
                                   `tel` varchar(50) DEFAULT NULL COMMENT '电话',
                                   `address` varchar(255) DEFAULT NULL COMMENT '地址',
                                   `scope` varchar(500) DEFAULT NULL COMMENT '经营范围以逗号分割：1 xxxa，2 xxxb，3 xxxc',
                                   `area_id` int(11) DEFAULT NULL COMMENT '行政区域id',
                                   `area` varchar(100) DEFAULT NULL COMMENT '行政区域名称',
                                   `parent_name` varchar(100) NOT NULL DEFAULT '' COMMENT '上级部门名称',
                                   `parent_id` int(11) NOT NULL DEFAULT '0' COMMENT '上级部门',
                                   `region_id` bigint(20) DEFAULT NULL COMMENT '区域id',
                                   `region_name` varchar(32) DEFAULT NULL COMMENT '区域名称',
                                   `organization_id` int(11) NOT NULL DEFAULT '0' COMMENT '所属组织',
                                   `district_group_id` int(11) DEFAULT NULL COMMENT '区/班组ID',
                                   `district_group_name` varchar(32) DEFAULT NULL COMMENT '角色组名称',
                                   `property` int(255) DEFAULT NULL COMMENT '部门属性',
                                   `operation_pattern` int(11) NOT NULL DEFAULT '0' COMMENT '经营模式',
                                   `del_flag` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除状态0:正常,1:删除',
                                   `create_by` bigint(20) DEFAULT NULL COMMENT '创建人',
                                   `create_user` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '创建人姓名',
                                   `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                   `update_by` bigint(20) DEFAULT NULL COMMENT '修改人',
                                   `update_user` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '修改人姓名',
                                   `last_update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '最后修改时间',
                                   PRIMARY KEY (`id`),
                                   UNIQUE KEY `index_code` (`code`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



