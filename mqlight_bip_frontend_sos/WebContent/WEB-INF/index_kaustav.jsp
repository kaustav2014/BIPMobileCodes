<%@page import="java.util.HashMap"%>
<%@page import="java.util.Iterator"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.Map"%>
<%@page import="java.io.InputStreamReader"%>
<%@page import="java.io.BufferedReader"%>
<%@page import="com.ibm.json.java.JSONObject"%>
<%@page import="java.util.StringTokenizer"%>
<%@page import="javax.jms.MessageProducer"%>
<%@page import="javax.jms.Destination"%>
<%@page import="javax.jms.JMSException"%>
<%@page import="javax.jms.TextMessage"%>
<%@page import="javax.jms.QueueSender"%>
<%@page import="javax.jms.Session"%>
<%@page import="javax.jms.QueueSession"%>
<%@page import="javax.jms.QueueConnection"%>
<%@page import="javax.jms.QueueConnectionFactory"%>
<%@page import="javax.jms.ConnectionFactory"%>
<%@page import="javax.naming.InitialContext"%>
<%@page import="javax.naming.Context"%>
<%@page import="java.util.Properties"%>
<%@page import="javax.jms.Connection"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="java.beans.Statement"%>
<%@page import="java.net.URL"%>
<%@page import="java.net.URLConnection"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
	<%
	
		URL url = new URL("http://mqlightsample-j2ee-nonextensile-phlebotomisation.mybluemix.net/getVCAP.jsp");
         out.println("2</br>");
         URLConnection urlCon = url.openConnection();
         out.println("3</br>");
          BufferedReader in = new BufferedReader(new InputStreamReader(
                                   urlCon.getInputStream()));
                                   out.println("4</br>");
        String line="";
        String inputLine;
        while ((inputLine = in.readLine()) != null) {
        line = line + inputLine;
            System.out.println(inputLine);
            }
        in.close();
        
        JSONObject vcap = null;
        System.out.println("vcap value: "+line);
        
	    if (line != null) 
		{ 
		line = line.replace("\"tags\":[\"web_and_app\",\"ibm_created\"],", "");
		line = line.replace("[", "");
		line = line.replace("]", "");
		
			vcap = (JSONObject) JSONObject.parse(line);
		}
		
		
		String var1 = request.getParameter("text1");
		System.out.println("Connection factory successfully created 1");
		out.println("messaging 1" + var1 + "<br/>");
		Properties properties = new Properties();
		//properties.putAll((HashMap)vcap);
		
		
		
		/* = ((Map)vcap.get("credentials"));
		
		Iterator itr = st.iterator();
		
		while(itr.hasNext()){
		(String)itr.next();
		
		}*/
		
		properties.put(Context.PROVIDER_URL,
						((HashMap)((HashMap)((HashMap)vcap).get("mqlight")).get("credentials")).get("connectionLookupURI"));
		properties.put(Context.SECURITY_CREDENTIALS, ((HashMap)((HashMap)((HashMap)vcap).get("mqlight")).get("credentials")).get("password"));
		properties.put(Context.SECURITY_PRINCIPAL, ((HashMap)((HashMap)((HashMap)vcap).get("mqlight")).get("credentials")).get("username"));
		//InitialContext ctx = new InitialContext(properties); 
		InitialContext ctx = new InitialContext(properties);
		out.println("Environment "+ctx.getEnvironment()+"<BR/>");
		
		out.println("Environment "+ctx.getNameInNamespace()+"<BR/>");
		
		System.out.println("Connection factory successfully created 2");
		ConnectionFactory mqlightCF = (ConnectionFactory) ctx
				.lookup("java:comp/env/jms/" + "MQLight-sampleservice");
		//ConnectionFactory mqlightCF = (ConnectionFactory)ctx.lookup("http://mqlightprod-lookup.ng.bluemix.net/Lookup?serviceId=716242b9-f22b-448a-a228-0128f9885acd");
		System.out.println("Connection factory successfully created 3");
		out.println("messaging 2" + "<br/>");

		Connection jmsConn = null;
		try {

			jmsConn = mqlightCF.createConnection();
			System.out.println("Connection factory successfully created 4");

			// Create a session.
			Session jmsSess = jmsConn.createSession(false,
					Session.AUTO_ACKNOWLEDGE);
			out.println("messaging 3" + "<br/>");
			System.out.println("Connection factory successfully created 5");
			// Create a producer on our topic
			Destination publishDest = jmsSess
					.createTopic("mqlight/sample/words");
			System.out.println("Connection factory successfully created 6");
			MessageProducer producer = jmsSess.createProducer(publishDest);
			out.println("messaging 4" + "<br/>");
			System.out.println("Connection factory successfully created 7");
			// Create our message
			if (var1 != null) {
				StringTokenizer strtok = new StringTokenizer(var1, " ");
				int tokens = strtok.countTokens();
				while (strtok.hasMoreTokens()) {
					// Create the JSON payload
					JSONObject jsonPayload = new JSONObject();
					jsonPayload.put("word", strtok.nextToken());
					jsonPayload.put("frontend", "LibertyJava: "
							+ toString());

					// Create our message
					TextMessage textMessage = jmsSess
							.createTextMessage(jsonPayload.serialize());

					//TextMessage textMessage = jmsSess.createTextMessage(var1);
					System.out.println("Connection factory successfully created 8");
					// Send it
					System.out.println("Sending message "
							+ textMessage.getText());
					producer.send(textMessage);
				}
			}
			System.out.println("Connection factory successfully created 9");

			out.println("messaging 5" + "<br/>");

		} catch (JMSException e) {

			out.println("messaging 5" + e.getMessage() + "<br/>");
			throw new RuntimeException(e);
		} finally {
			// Ensure we cleanup our connection
			try {
				if (jmsConn != null)
					jmsConn.close();
			} catch (Exception e) {
				System.out
						.println("Exception closing connection to MQ Light");
			}
			ctx.close();
		}
	%>
	<H1>Submitting Text Fields</H1>
	<FORM ACTION="index_kaustav.jsp" METHOD="POST">
		Please enter your message: <INPUT TYPE="TEXT" NAME="text1"> <BR>

		<INPUT TYPE="SUBMIT" value="Submit">


	</FORM>
</body>
</html>