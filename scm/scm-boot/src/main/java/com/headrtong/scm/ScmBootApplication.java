/*
 * Copyright (c) 2020 scm4cloud Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.headrtong.scm;

import com.headrtong.scm.common.security.annotation.EnableScmResourceServer;
import com.headrtong.scm.common.swagger.annotation.EnableScmDoc;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author lengleng 单体版本启动器，只需要运行此模块则整个系统启动
 */
@EnableScmDoc(value = "admin", isMicro = false)
@EnableScmResourceServer
@SpringBootApplication
public class ScmBootApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScmBootApplication.class, args);
	}

}
