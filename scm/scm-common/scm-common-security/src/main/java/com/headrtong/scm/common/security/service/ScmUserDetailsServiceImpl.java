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

package com.headrtong.scm.common.security.service;

import com.headrtong.scm.admin.api.dto.UserDTO;
import com.headrtong.scm.admin.api.dto.UserInfo;
import com.headrtong.scm.admin.api.feign.RemoteUserService;
import com.headrtong.scm.common.core.constant.CacheConstants;
import com.headrtong.scm.common.core.util.R;
import com.headrtong.scm.common.core.util.WebUtils;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * 用户详细信息
 *
 * @author lengleng hccake
 */
@Slf4j
@Primary
@RequiredArgsConstructor
public class ScmUserDetailsServiceImpl implements ScmUserDetailsService {

	private final RemoteUserService remoteUserService;

	private final CacheManager cacheManager;

	/**
	 * 用户名密码登录
	 * @param username 用户名
	 * @return
	 */
	@Override
	@SneakyThrows
	public UserDetails loadUserByUsername(String username) {
		try {
			String clientId = WebUtils.getClientId();
			log.info("clientId: {}", clientId);
		} catch (Exception e) {
			log.info("loadUserByUsername->clientId: {}", e.getMessage());
		}


		Cache cache = cacheManager.getCache(CacheConstants.USER_DETAILS);
		if (cache != null && cache.get(username) != null) {
			return (ScmUser) cache.get(username).get();
		}

		UserDTO userDTO = new UserDTO();
		userDTO.setUsername(username);
		R<UserInfo> result = remoteUserService.info(userDTO);
		UserDetails userDetails = getUserDetails(result);
		if (cache != null) {
			cache.put(username, userDetails);
		}
		return userDetails;
	}

	@Override
	public int getOrder() {
		return Integer.MIN_VALUE;
	}

}
