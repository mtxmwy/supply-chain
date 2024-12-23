

CREATE TABLE `sys_front_role` (
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

CREATE TABLE `sys_front_role_menu` (
                                 `role_id` int(11) NOT NULL COMMENT '角色ID',
                                 `menu_id` int(11) NOT NULL COMMENT '菜单ID',
                                 PRIMARY KEY (`role_id`,`menu_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单表';


CREATE TABLE `sys_front_menu` (
                            `menu_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
                            `name` varchar(32) DEFAULT NULL,
                            `permission` varchar(32) DEFAULT NULL,
                            `path` varchar(128) DEFAULT NULL,
                            `parent_id` int(11) DEFAULT NULL COMMENT '父菜单ID',
                            `icon` varchar(32) DEFAULT NULL,
                            `sort` int(11) DEFAULT '1' COMMENT '排序值',
                            `keep_alive` char(1) DEFAULT '0',
                            `type` char(1) DEFAULT '0',
                            `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                            `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                            `del_flag` char(1) DEFAULT '0',
                            `tenant_id` int(11) unsigned DEFAULT NULL COMMENT '租户ID',
                            PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='菜单权限表';
