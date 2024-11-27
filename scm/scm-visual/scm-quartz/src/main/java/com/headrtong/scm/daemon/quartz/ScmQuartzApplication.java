package com.headrtong.scm.daemon.quartz;

import com.headrtong.scm.common.feign.annotation.EnableScmFeignClients;
import com.headrtong.scm.common.security.annotation.EnableScmResourceServer;
import com.headrtong.scm.common.swagger.annotation.EnableScmDoc;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @author frwcloud
 * @date 2023-07-05
 */
@EnableScmDoc("job")
@EnableScmFeignClients
@EnableScmResourceServer
@EnableDiscoveryClient
@SpringBootApplication
public class ScmQuartzApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScmQuartzApplication.class, args);
	}

}
