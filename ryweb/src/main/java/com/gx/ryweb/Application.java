package com.gx.ryweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

/**
 * @author MeepoGuan
 *
 * <p>Description: 入口</p>
 *
 * 2017年4月29日
 *
 */
@SpringBootApplication
public class Application{
	  public static void main( String[] args )
	    {
	        SpringApplication.run(Application.class, args);
	    }
	  
	  protected SpringApplicationBuilder configure(
	            SpringApplicationBuilder application) {
	        return application.sources(Application.class);
	    }
}
